"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContactForm } from "@/components/support/ContactForm"
import { useSupportMock } from "@/lib/hooks/use-support-mock"
import { BookOpen, Upload, CreditCard, BarChart, Users, HelpCircle } from "lucide-react"

export default function SupportPage() {
  const { faqs, guides, isLoading } = useSupportMock()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState(faqs)
  const [activeTab, setActiveTab] = useState("help-center")
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter FAQs when search query changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredFaqs(
        faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredFaqs(faqs)
    }
  }, [searchQuery, faqs])

  if (!mounted) return null

  const iconMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen className="h-6 w-6 text-primary" />,
    Upload: <Upload className="h-6 w-6 text-primary" />,
    CreditCard: <CreditCard className="h-6 w-6 text-primary" />,
    BarChart: <BarChart className="h-6 w-6 text-primary" />,
    Users: <Users className="h-6 w-6 text-primary" />,
    HelpCircle: <HelpCircle className="h-6 w-6 text-primary" />,
    FileText: <BookOpen className="h-6 w-6 text-primary" />,
    FileEdit: <BookOpen className="h-6 w-6 text-primary" />,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="mt-2 text-lg text-neutral-600">Get help with CFIPros</p>
      </div>

      <Tabs defaultValue="help-center" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="help-center">Help Center</TabsTrigger>
          <TabsTrigger value="contact-support">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="help-center" className="space-y-8">
          {/* Search bar */}
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* FAQs */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-md bg-neutral-100" />
                  ))}
                </div>
              ) : filteredFaqs.length === 0 ? (
                <p className="text-center text-neutral-500">No FAQs found matching your search.</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            {/* Guides */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Tutorials & Guides</h2>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-md bg-neutral-100" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {guides.map((guide) => (
                    <Card key={guide.id} className={guide.comingSoon ? "opacity-70" : ""}>
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="rounded-md bg-primary/10 p-2">
                          {iconMap[guide.icon] || <BookOpen className="h-6 w-6 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{guide.title}</h3>
                            {guide.comingSoon && (
                              <Badge variant="outline" className="bg-neutral-100 text-neutral-600">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-neutral-600">{guide.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact-support">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Fill out the form below to get in touch with our support team.</CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
