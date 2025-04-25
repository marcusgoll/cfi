"use client"

import { useState, useEffect } from "react"

export type FAQItem = {
  id: string
  question: string
  answer: string
  category: string
}

export type Guide = {
  id: string
  title: string
  description: string
  icon: string
  url: string
  comingSoon?: boolean
}

export type SupportData = {
  faqs: FAQItem[]
  guides: Guide[]
  isLoading: boolean
}

export type SupportTicket = {
  id: string
  subject: string
  description: string
  attachments?: File[]
  status: "submitted" | "in-progress" | "resolved"
  createdAt: string
}

export function useSupportMock(): SupportData & {
  submitTicket: (ticket: Omit<SupportTicket, "id" | "status" | "createdAt">) => Promise<SupportTicket>
} {
  const [data, setData] = useState<SupportData>({
    faqs: [],
    guides: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockFAQs: FAQItem[] = [
        {
          id: "1",
          question: "How do I upload a test report?",
          answer:
            "To upload a test report, navigate to the Reports section in the sidebar, click the 'Upload Report' button, select the student from the dropdown (or create a new one), and then drag and drop your report file or click to browse.",
          category: "Reports",
        },
        {
          id: "2",
          question: "Can I process multiple reports at once?",
          answer:
            "Yes, you can upload multiple reports at once using the Batch Upload feature. Click 'Batch Upload' instead of 'Upload Report', select multiple files, assign students to each report, and process all reports at once.",
          category: "Reports",
        },
        {
          id: "3",
          question: "How do I invite a student to my organization?",
          answer:
            "To invite a student, go to Settings > Organization, click 'Invite User', enter the student's email address, select the 'Student' role, and click 'Send Invite'. The student will receive an email with instructions to join your organization.",
          category: "Organization",
        },
        {
          id: "4",
          question: "What is the difference between the Free and Pro plans?",
          answer:
            "The Free plan includes up to 5 students, basic analytics, and 10 report uploads per month. The Pro plan offers unlimited students, advanced analytics, unlimited report uploads, custom training recommendations, and priority support.",
          category: "Billing",
        },
        {
          id: "5",
          question: "How do I cancel my subscription?",
          answer:
            "To cancel your Pro subscription, go to Settings > Billing, click 'Cancel Subscription', and follow the prompts to confirm cancellation. Your Pro features will remain active until the end of your current billing period.",
          category: "Billing",
        },
        {
          id: "6",
          question: "Can I export my data from CFIPros?",
          answer:
            "Yes, you can export your data from CFIPros. Go to Settings > Data, click 'Export Data', select the data you want to export (students, reports, analytics), and click 'Export'. You'll receive an email with a link to download your data in CSV or JSON format.",
          category: "Data",
        },
      ]

      const mockGuides: Guide[] = [
        {
          id: "1",
          title: "Getting Started with CFIPros",
          description: "Learn the basics of setting up your account and navigating the platform.",
          icon: "BookOpen",
          url: "/knowledge-base/getting-started-with-cfipros",
        },
        {
          id: "2",
          title: "Uploading and Analyzing Reports",
          description: "A comprehensive guide to uploading and analyzing FAA test reports.",
          icon: "FileText",
          url: "/knowledge-base/how-to-upload-faa-test-reports",
        },
        {
          id: "3",
          title: "Managing Students",
          description: "Learn how to add, organize, and track your flight students.",
          icon: "Users",
          url: "/knowledge-base/managing-students",
        },
        {
          id: "4",
          title: "Advanced Analytics",
          description: "Dive deep into the analytics features of CFIPros Pro.",
          icon: "BarChart",
          url: "/knowledge-base/advanced-analytics",
          comingSoon: true,
        },
        {
          id: "5",
          title: "Creating Custom Lesson Plans",
          description: "Learn how to create personalized lesson plans based on test results.",
          icon: "FileEdit",
          url: "/knowledge-base/creating-custom-lesson-plans",
          comingSoon: true,
        },
      ]

      setData({
        faqs: mockFAQs,
        guides: mockGuides,
        isLoading: false,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const submitTicket = async (ticket: Omit<SupportTicket, "id" | "status" | "createdAt">): Promise<SupportTicket> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      status: "submitted",
      createdAt: new Date().toISOString(),
    }

    return newTicket
  }

  return {
    ...data,
    submitTicket,
  }
}
