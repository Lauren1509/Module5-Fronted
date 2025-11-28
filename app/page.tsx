"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Copy, Link2, Loader2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function URLShortenerPage() {
  const [longUrl, setLongUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!longUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    // Validate URL format
    try {
      new URL(longUrl)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to shorten URL")
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)

      toast({
        title: "Success!",
        description: "Your URL has been shortened",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setLongUrl("")
    setShortUrl("")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            <span className="text-xl font-semibold">URLShort</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Shorten your links in seconds
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-xl mx-auto">
              Transform long URLs into short, shareable links. Fast, simple, and reliable.
            </p>
          </div>

          {/* URL Shortener Form */}
          {!shortUrl ? (
            <Card className="p-6 md:p-8 space-y-6">
              <form onSubmit={handleShorten} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="longUrl" className="text-sm font-medium">
                    Enter your long URL
                  </label>
                  <Input
                    id="longUrl"
                    type="url"
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-5 w-5" />
                      Shorten URL
                    </>
                  )}
                </Button>
              </form>
            </Card>
          ) : (
            /* Result Card */
            <Card className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                  <Link2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold">Your shortened URL</h2>
                <p className="text-sm text-muted-foreground">Share this link anywhere</p>
              </div>

              <div className="space-y-4">
                {/* Original URL */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Original URL
                  </label>
                  <div className="p-3 bg-muted rounded-lg text-sm break-all">{longUrl}</div>
                </div>

                {/* Short URL */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Short URL</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-primary/5 border-2 border-primary/20 rounded-lg text-base font-mono font-semibold break-all">
                      {shortUrl}
                    </div>
                    <Button onClick={handleCopy} size="lg" variant="default" className="shrink-0">
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleReset} variant="outline" size="lg" className="flex-1 bg-transparent">
                    Shorten Another
                  </Button>
                  <Button asChild variant="default" size="lg" className="flex-1">
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Test Link
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Fast</div>
              <p className="text-sm text-muted-foreground">Get your short link instantly</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Simple</div>
              <p className="text-sm text-muted-foreground">No registration required</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Reliable</div>
              <p className="text-sm text-muted-foreground">Powered by AWS infrastructure</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built with modern web technologies. Module 5 - URL Shortener Frontend.</p>
        </div>
      </footer>
    </div>
  )
}
