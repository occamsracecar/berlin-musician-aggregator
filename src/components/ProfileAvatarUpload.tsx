"use client";

import Image from "next/image";
import { DragEvent, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ProfileAvatarUploadProps = {
  userId: string;
  initialUrl: string | null;
  onUrlChange: (url: string | null) => void;
};

/**
 * Drag-and-drop zone for uploading a profile avatar to Supabase Storage.
 */
export function ProfileAvatarUpload({
  userId,
  initialUrl,
  onUrlChange,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads an image file and returns the public URL.
   */
  async function uploadFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use JPEG, PNG, WebP, or GIF.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("Image must be 2 MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);

    const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const path = `${userId}/avatar.${extension}`;
    const supabase = createSupabaseBrowserClient();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploading(false);
      setError("Upload failed. Please try again.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    setPreviewUrl(publicUrl);
    onUrlChange(publicUrl);
    setUploading(false);
  }

  /**
   * Handles files from drag-and-drop or file picker.
   */
  function handleFiles(files: FileList | null) {
    const file = files?.[0];

    if (file) {
      void uploadFile(file);
    }
  }

  /**
   * Prevents default so the drop zone accepts files.
   */
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(true);
  }

  /**
   * Handles file drop on the upload zone.
   */
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    handleFiles(event.dataTransfer.files);
  }

  /**
   * Removes the current avatar preview and stored URL reference.
   */
  function handleRemove() {
    setPreviewUrl(null);
    onUrlChange(null);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700">Profile image</span>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 transition",
          dragOver
            ? "border-violet-400 bg-violet-50"
            : "border-zinc-300 bg-zinc-50 hover:border-violet-300 hover:bg-violet-50/50",
        ].join(" ")}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Profile preview"
            width={96}
            height={96}
            className="size-24 rounded-full border border-zinc-200 object-cover"
          />
        ) : (
          <div className="flex size-24 items-center justify-center rounded-full bg-zinc-200 text-sm text-zinc-500">
            Photo
          </div>
        )}
        <p className="text-center text-sm text-zinc-600">
          {uploading
            ? "Uploading..."
            : "Drag and drop an image here, or click to choose"}
        </p>
        <p className="text-xs text-zinc-400">JPEG, PNG, WebP or GIF · max 2 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {previewUrl ? (
        <button
          type="button"
          onClick={handleRemove}
          className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Remove photo
        </button>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
