"use client"

import { useState, useEffect } from "react"

export type KnowledgeCategory = {
  id: string
  title: string
  description: string
  icon: string
  articleCount: number
}

export type KnowledgeArticle = {
  id: string
  slug: string
  title: string
  categoryId: string
  categoryTitle: string
  content: string
  createdAt: string
  updatedAt: string
  toc: {
    id: string
    title: string
    level: number
  }[]
}

export type KnowledgeBaseData = {
  categories: KnowledgeCategory[]
  articles: KnowledgeArticle[]
  isLoading: boolean
}

export function useKnowledgeBaseMock(slug?: string): KnowledgeBaseData {
  const [data, setData] = useState<KnowledgeBaseData>({
    categories: [],
    articles: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const categories: KnowledgeCategory[] = [
        {
          id: "getting-started",
          title: "Getting Started",
          description: "Learn the basics of CFIPros and how to set up your account",
          icon: "BookOpen",
          articleCount: 5,
        },
        {
          id: "report-upload",
          title: "Report Upload",
          description: "How to upload and process FAA test reports",
          icon: "Upload",
          articleCount: 3,
        },
        {
          id: "subscriptions",
          title: "Subscriptions",
          description: "Manage your subscription and billing information",
          icon: "CreditCard",
          articleCount: 4,
        },
        {
          id: "analytics",
          title: "Analytics",
          description: "Understanding your student performance analytics",
          icon: "BarChart",
          articleCount: 6,
        },
        {
          id: "student-management",
          title: "Student Management",
          description: "Managing your flight students and their progress",
          icon: "Users",
          articleCount: 7,
        },
        {
          id: "troubleshooting",
          title: "Troubleshooting",
          description: "Common issues and how to resolve them",
          icon: "HelpCircle",
          articleCount: 8,
        },
      ]

      const articles: KnowledgeArticle[] = [
        {
          id: "1",
          slug: "getting-started-with-cfipros",
          title: "Getting Started with CFIPros",
          categoryId: "getting-started",
          categoryTitle: "Getting Started",
          content: `
# Getting Started with CFIPros

Welcome to CFIPros! This guide will help you get started with our platform and make the most of your flight training experience.

## Creating Your Account

To get started with CFIPros, you'll need to create an account. Follow these steps:

1. Visit the CFIPros website at [cfipros.com](https://cfipros.com)
2. Click on the "Sign Up" button in the top right corner
3. Enter your email address and create a password
4. Verify your email address by clicking the link in the verification email
5. Complete your profile by adding your name and other details

## Setting Up Your Organization

If you're a flight instructor or flight school administrator, you can set up your organization to manage multiple students:

1. Go to Settings > Organization
2. Click "Create Organization"
3. Enter your organization details
4. Invite instructors and students to join your organization

## Uploading Your First Report

Once your account is set up, you can upload your first FAA test report:

1. Click on "New Report" in the sidebar
2. Select the student (or create a new one)
3. Upload the FAA test report PDF
4. Review the automatically extracted data
5. Save the report

## Next Steps

After setting up your account and uploading your first report, you can:

- Analyze student performance in the Analytics section
- Create custom training plans based on identified weaknesses
- Track student progress over time
- Generate endorsements and training recommendations

If you need any help, don't hesitate to contact our support team at support@cfipros.com.
          `,
          createdAt: "2023-01-15",
          updatedAt: "2023-03-20",
          toc: [
            { id: "1", title: "Getting Started with CFIPros", level: 1 },
            { id: "2", title: "Creating Your Account", level: 2 },
            { id: "3", title: "Setting Up Your Organization", level: 2 },
            { id: "4", title: "Uploading Your First Report", level: 2 },
            { id: "5", title: "Next Steps", level: 2 },
          ],
        },
        {
          id: "2",
          slug: "how-to-upload-faa-test-reports",
          title: "How to Upload FAA Test Reports",
          categoryId: "report-upload",
          categoryTitle: "Report Upload",
          content: `
# How to Upload FAA Test Reports

This guide explains how to upload and process FAA test reports in CFIPros.

## Supported Report Types

CFIPros supports the following FAA test report types:

- Knowledge Test Reports (AKTR)
- Practical Test Reports
- Flight Review Forms
- Proficiency Check Forms

## Uploading a Report

To upload a report:

1. Navigate to the Reports section in the sidebar
2. Click the "Upload Report" button
3. Select the student from the dropdown (or create a new one)
4. Drag and drop your report file or click to browse
5. Wait for the upload and processing to complete

## Processing Time

Most reports are processed within seconds, but complex reports may take up to a minute. The system will automatically extract:

- Test scores and results
- Knowledge areas with deficiencies
- ACS codes for missed questions
- Recommendations for further study

## Batch Uploads

You can upload multiple reports at once:

1. Click "Batch Upload" instead of "Upload Report"
2. Select multiple files
3. Assign students to each report
4. Process all reports at once

## Troubleshooting Upload Issues

If you encounter issues with report uploads:

- Ensure the file is a clear, readable PDF
- Check that the file size is under 10MB
- Verify the report is a standard FAA format
- Try rescanning the document if it's a physical copy

For additional help, contact support@cfipros.com.
          `,
          createdAt: "2023-02-10",
          updatedAt: "2023-04-15",
          toc: [
            { id: "1", title: "How to Upload FAA Test Reports", level: 1 },
            { id: "2", title: "Supported Report Types", level: 2 },
            { id: "3", title: "Uploading a Report", level: 2 },
            { id: "4", title: "Processing Time", level: 2 },
            { id: "5", title: "Batch Uploads", level: 2 },
            { id: "6", title: "Troubleshooting Upload Issues", level: 2 },
          ],
        },
        {
          id: "3",
          slug: "managing-your-subscription",
          title: "Managing Your Subscription",
          categoryId: "subscriptions",
          categoryTitle: "Subscriptions",
          content: `
# Managing Your Subscription

Learn how to manage your CFIPros subscription, including upgrading, downgrading, and billing information.

## Subscription Plans

CFIPros offers the following subscription plans:

### Free Plan
- Up to 5 students
- Basic analytics
- 10 report uploads per month

### Pro Plan
- Unlimited students
- Advanced analytics
- Unlimited report uploads
- Custom training recommendations
- Priority support

## Upgrading Your Subscription

To upgrade from Free to Pro:

1. Go to Settings > Billing
2. Click "Upgrade to Pro"
3. Enter your payment information
4. Confirm your subscription

Your Pro features will be activated immediately.

## Managing Payment Methods

To update your payment method:

1. Go to Settings > Billing
2. Click "Payment Methods"
3. Add a new payment method or edit existing ones
4. Set your default payment method

## Billing Cycles and Invoices

CFIPros bills on a monthly or annual basis, depending on your preference. Annual subscriptions receive a 20% discount.

To view your invoices:

1. Go to Settings > Billing
2. Click "Invoices"
3. Download or print any invoice

## Cancelling Your Subscription

To cancel your Pro subscription:

1. Go to Settings > Billing
2. Click "Cancel Subscription"
3. Follow the prompts to confirm cancellation

Your Pro features will remain active until the end of your current billing period.

## FAQs

**Q: Can I switch between monthly and annual billing?**
A: Yes, you can switch when renewing your subscription.

**Q: Is there a refund policy?**
A: We offer a 14-day money-back guarantee for new Pro subscriptions.

**Q: Can I upgrade in the middle of a billing cycle?**
A: Yes, you'll be charged the prorated amount for the remainder of your billing cycle.
          `,
          createdAt: "2023-03-05",
          updatedAt: "2023-05-10",
          toc: [
            { id: "1", title: "Managing Your Subscription", level: 1 },
            { id: "2", title: "Subscription Plans", level: 2 },
            { id: "3", title: "Free Plan", level: 3 },
            { id: "4", title: "Pro Plan", level: 3 },
            { id: "5", title: "Upgrading Your Subscription", level: 2 },
            { id: "6", title: "Managing Payment Methods", level: 2 },
            { id: "7", title: "Billing Cycles and Invoices", level: 2 },
            { id: "8", title: "Cancelling Your Subscription", level: 2 },
            { id: "9", title: "FAQs", level: 2 },
          ],
        },
      ]

      if (slug) {
        const filteredArticles = articles.filter((article) => article.slug === slug)
        setData({
          categories,
          articles: filteredArticles,
          isLoading: false,
        })
      } else {
        setData({
          categories,
          articles,
          isLoading: false,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  return data
}
