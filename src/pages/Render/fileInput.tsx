"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import React, { useState, useRef } from "react"
import { UploadCloud, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const RenderFileSchema = z.object({
  file: z
    .custom<FileList | null>((val) => val instanceof FileList || val === null, { message: "A file is required." })
    .refine((files) => files && files.length > 0, "A .blend or .zip file is required.")
    .refine((files) => {
      const file = files?.[0]
      if (!file) return false
      const isZip = file.type === "application/zip" || file.type === "application/x-zip-compressed" || file.name.endsWith(".zip")
      const isBlend = file.name.endsWith(".blend")
      return isZip || isBlend
    }, "Only .blend or .zip files are allowed."),
  startFrame: z.number().min(1, "Start Frame must be at least 1"),
  endFrame: z.number().min(1, "End Frame must be at least 1"),
})

export function RenderFile() {
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof RenderFileSchema>>({
    resolver: zodResolver(RenderFileSchema),
    defaultValues: { file: null },
  })

  // Drag & Drop Handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation() }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) form.setValue("file", files, { shouldValidate: true })
  }

  const onSubmit = async (values: z.infer<typeof RenderFileSchema>) => {
    const file = values.file?.[0]
    if (!file) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication error. Please log in again.")
        setLoading(false)
        return
      }

      // Get signed URL from backend
      const signedUrlApiResponse = await fetch("http://10.201.48.47:4000/api/files/upload", {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, startFrame: values.startFrame, endFrame: values.endFrame }),
      })

      if (!signedUrlApiResponse.ok) {
        const errorText = await signedUrlApiResponse.text()
        throw new Error(JSON.parse(errorText).message || "Failed to get a secure upload URL.")
      }

      const { url } = await signedUrlApiResponse.json()
      if (!url) throw new Error("Server response did not include an uploadUrl.")

      // Upload file to signed URL
      const uploadResponse = await fetch(url, { method: 'PUT', headers: { 'Content-Type': "application/octet-stream" }, body: file })
      if (!uploadResponse.ok) throw new Error(`File upload failed: ${await uploadResponse.text()}`)

      toast.success("🎉 File processed successfully!")
      form.reset()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Something went wrong during the upload!")
    } finally { setLoading(false) }
  }

  if (loading) return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl  text-white shadow-inner"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
    >
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      <h2 className="text-xl font-semibold">Processing Your File...</h2>
      <p className="text-gray-400 text-center">Uploading and preparing your project.<br />Please wait a moment.</p>
    </motion.div>
  )

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-orange-500">Render Your Project</h1>
        <p className="text-gray-400 text-sm">
          Drag & drop your <span className="font-semibold text-orange-500">.blend</span> or <span className="font-semibold text-orange-500">.zip</span> file and set the frame range below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <FormField control={form.control} name="file" render={({ field }) => (
            <FormItem>
              <FormControl>
                <motion.div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-full h-56 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
                    isDragging ? "border-orange-500 bg-orange-500/10" : "border-gray-700 hover:border-orange-400"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <UploadCloud className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="font-semibold">{(form.watch("file") as FileList | null)?.[0]?.name || "Drag & drop file here or click to browse"}</p>
                  <Input
                    type="file"
                    accept=".zip,.blend"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => field.onChange(e.target.files ?? null)}
                  />
                </motion.div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Frame Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="startFrame" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Start Frame</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="endFrame" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">End Frame</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 250"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 text-lg py-4 font-bold"
              disabled={loading || !form.formState.isValid}
            >
              Render File
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  )
}
