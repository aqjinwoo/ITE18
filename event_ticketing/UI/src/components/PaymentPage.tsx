'use client'

import { useState, useEffect } from "react";
import { User, Page, Event } from "../types";
import { LayoutDashboard } from "./LayoutDashboard";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle2,
  Smartphone,
  Wallet,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ticketsApi, paymentsApi } from "../services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface PaymentPageProps {
  event: Event;
  user: User;
  onNavigate: (page: Page, event?: Event) => void;
  onLogout: () => void;
}

export function PaymentPage({
  event,
  user,
  onNavigate,
  onLogout,
}: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load ticket quantity from localStorage
  useEffect(() => {
    const storedQuantity = localStorage.getItem('purchase_quantity');
    if (storedQuantity) {
      setTicketQuantity(parseInt(storedQuantity));
      localStorage.removeItem('purchase_quantity');
      localStorage.removeItem('purchase_event_id');
    }
  }, []);

  // Calculate total amount
  useEffect(() => {
    const subtotal = (event.price || 0) * ticketQuantity;
    const serviceFee = subtotal * 0.05;
    setTotalAmount(subtotal + serviceFee);
  }, [event.price, ticketQuantity]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create tickets (one per quantity)
      const ticketPromises = [];
      for (let i = 0; i < ticketQuantity; i++) {
        ticketPromises.push(ticketsApi.purchaseTicket({ event_id: event.id! }));
      }
      
      const tickets = await Promise.all(ticketPromises);
      
      // Create payment for each ticket
      const paymentPromises = tickets.map(ticket =>
        paymentsApi.createPayment({
          ticket_id: ticket.id!,
          amount: (event.price || 0) + ((event.price || 0) * 0.05), // price + service fee
          payment_method: paymentMethod,
        })
      );
      
      await Promise.all(paymentPromises);
      
      setShowSuccess(true);
      toast.success("Payment successful!");
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onNavigate("user-dashboard");
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted =
      cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  return (
    <LayoutDashboard
      user={user}
      onNavigate={onNavigate}
      onLogout={onLogout}
      currentPage="payment"
    >
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => onNavigate("events")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground">
            Enter your payment details to complete the purchase
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">
                      Payment Method *
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>Credit Card</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="debit-card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>Debit Card</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gcash">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            <span>GCash</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="paypal">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            <span>PayPal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="paymaya">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            <span>PayMaya</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Card/Account fields - conditional based on payment method */}
                  {(paymentMethod === "credit-card" ||
                    paymentMethod === "debit-card") && (
                    <>
                      {/* Card Number */}
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">
                          Card Number *
                        </Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="bg-input border-border pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div className="space-y-2">
                        <Label htmlFor="cardName">
                          Cardholder Name *
                        </Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) =>
                            setCardName(e.target.value)
                          }
                          className="bg-input border-border"
                          required
                        />
                      </div>

                      {/* Expiry and CVV */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            className="bg-input border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value.length <= 4 &&
                                /^\d*$/.test(value)
                              ) {
                                setCvv(value);
                              }
                            }}
                            className="bg-input border-border"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(paymentMethod === "gcash" ||
                    paymentMethod === "paymaya") && (
                    <>
                      {/* Mobile Number */}
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">
                          Mobile Number *
                        </Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="mobileNumber"
                            placeholder="+63 912 345 6789"
                            className="bg-input border-border pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Account Name */}
                      <div className="space-y-2">
                        <Label htmlFor="accountName">
                          Account Name *
                        </Label>
                        <Input
                          id="accountName"
                          placeholder="Juan Dela Cruz"
                          className="bg-input border-border"
                          required
                        />
                      </div>
                    </>
                  )}

                  {paymentMethod === "paypal" && (
                    <>
                      {/* PayPal Email */}
                      <div className="space-y-2">
                        <Label htmlFor="paypalEmail">
                          PayPal Email *
                        </Label>
                        <div className="relative">
                          <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="paypalEmail"
                            type="email"
                            placeholder="your-email@example.com"
                            className="bg-input border-border pl-10"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">
                        Your payment information is encrypted
                        and secure. We never store your full
                        card details.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Payment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Event
                    </span>
                    <span className="text-right">
                      {event.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Tickets
                    </span>
                    <span>{ticketQuantity}x General</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>
                    <span>₱{((event.price || 0) * ticketQuantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Service Fee
                    </span>
                    <span>₱{(((event.price || 0) * ticketQuantity) * 0.05).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="text-2xl text-primary">
                        ₱{totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span>Instant e-ticket delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Payment Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your tickets have been sent to {user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Order ID:
                </span>
                <span>
                  #TXR{Math.floor(Math.random() * 100000)}
                </span>
              </div>
            </div>
            <Button
              onClick={handleSuccessClose}
              className="w-full bg-primary hover:bg-primary/90"
            >
              View My Tickets
            </Button>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Total Paid:
                    </span>
                    <span className="text-primary">₱{totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
          </div>
        </DialogContent>
      </Dialog>
    </LayoutDashboard>
  );
}