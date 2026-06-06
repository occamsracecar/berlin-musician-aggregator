#!/usr/bin/swift
import Foundation

/// Appends a timestamped line to the watcher log file.
func log(_ message: String) {
  let logDir = FileManager.default.homeDirectoryForCurrentUser
    .appendingPathComponent("Library/Logs/berlin-musicians", isDirectory: true)
  try? FileManager.default.createDirectory(at: logDir, withIntermediateDirectories: true)
  let logFile = logDir.appendingPathComponent("backstage-unlock-watcher.log")
  let line = "\(ISO8601DateFormatter().string(from: Date())) \(message)\n"
  if FileManager.default.fileExists(atPath: logFile.path),
     let handle = try? FileHandle(forWritingTo: logFile) {
    handle.seekToEndOfFile()
    handle.write(line.data(using: .utf8)!)
    try? handle.close()
  } else {
    try? line.write(to: logFile, atomically: true, encoding: .utf8)
  }
}

/// Spawns the Backstage scrape wrapper in the background (daily guard lives in bash).
func runScrapeWrapper() {
  let wrapper = ProcessInfo.processInfo.environment["BACKSTAGE_SCRAPE_WRAPPER"]
    ?? "\(FileManager.default.currentDirectoryPath)/scripts/scrape-backstage.sh"

  guard FileManager.default.isExecutableFile(atPath: wrapper) else {
    log("ERROR: wrapper not executable: \(wrapper)")
    return
  }

  let task = Process()
  task.executableURL = URL(fileURLWithPath: "/bin/bash")
  task.arguments = [wrapper]
  task.standardOutput = nil
  task.standardError = nil

  do {
    try task.run()
    log("Started scrape wrapper (pid \(task.processIdentifier))")
  } catch {
    log("ERROR: failed to start scrape: \(error.localizedDescription)")
  }
}

/// Registers screen-unlock handlers and keeps the LaunchAgent process alive.
func main() {
  log("Watcher started")

  let center = DistributedNotificationCenter.default()
  let unlockName = Notification.Name("com.apple.screenIsUnlocked")

  center.addObserver(forName: unlockName, object: nil, queue: nil) { _ in
    log("Screen unlocked — triggering scrape check")
    runScrapeWrapper()
  }

  // First start after login: run if today’s scrape has not succeeded yet.
  DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
    log("Initial scrape check after watcher start")
    runScrapeWrapper()
  }

  RunLoop.main.run()
}

main()
