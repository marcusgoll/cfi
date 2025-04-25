"use client"

import { useState } from "react"
import { ArrowUpRight, Check, CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useOrganizationMock } from "@/lib/hooks/use-organization-mock"

export default function BillingSettingsPage() {
  const { toast } = useToast()
  const { plan, invoices, isLoading } = useOrganizationMock()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = () => {
    setIsUpgrading(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpgrading(false)
      setUpgradeOpen(false)
      toast({
        title: "Upgrade successful",
        description: "Your account has been upgraded to Pro plan.",
      })
    }, 1500)
  }

  const proFeatures = [
    "Unlimited students",
    "Advanced analytics",
    "Custom report templates",
    "API access",
    "Priority support",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing Settings</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Your current plan and subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Current Plan:</h3>
                <Badge variant={plan === "pro" ? "default" : "outline"} className="uppercase">
                  {plan}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {plan === "free"
                  ? "Limited to 10 students and basic features"
                  : "Unlimited students and all premium features"}
              </p>
            </div>
            {plan === "free" && (
              <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
                <DialogTrigger asChild>
                  <Button>Upgrade to Pro</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade to Pro Plan</DialogTitle>
                    <DialogDescription>Get access to all premium features and unlimited students</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Pro Plan</CardTitle>
                        <CardDescription>$49/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {proFeatures.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpgrade} disabled={isUpgrading}>
                      {isUpgrading ? "Processing..." : "Upgrade Now"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div>
            <h3 className="mb-4 font-medium">Billing History</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-md bg-neutral-100" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-neutral-50">
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              invoice.status === "paid"
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-yellow-500 bg-yellow-50 text-yellow-700"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Download className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Download</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Secure payment processing by Stripe</span>
          </div>
          <Button variant="link" className="h-auto gap-1 p-0">
            <span>Billing FAQ</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
