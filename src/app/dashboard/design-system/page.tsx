"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Loader2,
    Mail,
    Search,
    AlertCircle,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper component for section headers
const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-6 pb-2 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
    </div>
);

// Helper for color swatches
const ColorSwatch = ({ name, colorClass, hex }: { name: string; colorClass: string; hex: string }) => (
    <div className="flex flex-col gap-2">
        <div className={cn("w-full h-24 rounded-lg shadow-sm border border-gray-100", colorClass)}></div>
        <div>
            <p className="font-semibold text-sm text-gray-900">{name}</p>
            <p className="text-xs text-gray-500 font-mono">{hex}</p>
        </div>
    </div>
);

export default function DesignSystemPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-12 space-y-16">

            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-chaiyo-blue">Design System</h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                    A comprehensive guide to the components, typography, and colors used in the AutoX LOS application.
                </p>
                <div className="flex gap-2">
                    <Badge variant="outline" className="border-chaiyo-blue text-chaiyo-blue">v1.0.0</Badge>
                    <Badge variant="secondary">Internal Use Only</Badge>
                </div>
            </div>

            {/* Colors */}
            <section id="colors">
                <SectionHeader title="Colors" description="Our brand palette and semantic colors." />

                <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                    <ColorSwatch name="Chaiyo Blue" colorClass="bg-chaiyo-blue" hex="#10069F" />
                    <ColorSwatch name="Chaiyo Gold" colorClass="bg-chaiyo-gold" hex="#FFD100" />
                    <ColorSwatch name="Chaiyo Accent" colorClass="bg-chaiyo-accent" hex="#FFD100 (Mapped)" />
                </div>

                <h3 className="text-lg font-semibold mb-4">Status Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                    <ColorSwatch name="Approved / Success" colorClass="bg-emerald-500" hex="#10B981" />
                    <ColorSwatch name="Pending / Warning" colorClass="bg-amber-500" hex="#F59E0B" />
                    <ColorSwatch name="Rejected / Error" colorClass="bg-red-500" hex="#EF4444" />
                </div>

                <h3 className="text-lg font-semibold mb-4">Netural / Grays</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    <ColorSwatch name="Gray 50" colorClass="bg-gray-50" hex="#F9FAFB" />
                    <ColorSwatch name="Gray 100" colorClass="bg-gray-100" hex="#F3F4F6" />
                    <ColorSwatch name="Gray 200" colorClass="bg-gray-200" hex="#E5E7EB" />
                    <ColorSwatch name="Gray 300" colorClass="bg-gray-300" hex="#D1D5DB" />
                    <ColorSwatch name="Gray 500" colorClass="bg-gray-500" hex="#6B7280" />
                    <ColorSwatch name="Gray 900" colorClass="bg-gray-900" hex="#111827" />
                </div>
            </section>

            {/* Typography */}
            <section id="typography">
                <SectionHeader title="Typography" description="Font family: IBM Plex Sans Thai" />

                <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4">
                        <div className="md:col-span-3 text-gray-400 text-sm">H1 / 4xl / Bold</div>
                        <div className="md:col-span-9"><h1 className="text-4xl font-bold text-gray-900">The quick brown fox jumps over the lazy dog</h1></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4">
                        <div className="md:col-span-3 text-gray-400 text-sm">H2 / 3xl / Bold</div>
                        <div className="md:col-span-9"><h2 className="text-3xl font-bold text-gray-900">The quick brown fox jumps over the lazy dog</h2></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4">
                        <div className="md:col-span-3 text-gray-400 text-sm">H3 / 2xl / Bold</div>
                        <div className="md:col-span-9"><h3 className="text-2xl font-bold text-gray-900">The quick brown fox jumps over the lazy dog</h3></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4">
                        <div className="md:col-span-3 text-gray-400 text-sm">H4 / xl / Semibold</div>
                        <div className="md:col-span-9"><h4 className="text-xl font-semibold text-gray-900">The quick brown fox jumps over the lazy dog</h4></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4">
                        <div className="md:col-span-3 text-gray-400 text-sm">Body / Base / Regular</div>
                        <div className="md:col-span-9"><p className="text-base text-gray-700">The quick brown fox jumps over the lazy dog. Documentation and examples for typography, including global settings and headings.</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-3 text-gray-400 text-sm">Small / sm / Medium</div>
                        <div className="md:col-span-9"><p className="text-sm font-medium text-gray-500">The quick brown fox jumps over the lazy dog</p></div>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <section id="buttons">
                <SectionHeader title="Buttons" description="Interactive elements for actions." />

                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-8">
                    {/* Variants */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Variants</h4>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button variant="default">Default (Primary)</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Sizes</h4>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon"><Search className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    {/* States */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">States</h4>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button disabled>Disabled</Button>
                            <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading</Button>
                            <Button className="gap-2"><Mail className="w-4 h-4" /> With Icon</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inputs & Forms */}
            <section id="forms">
                <SectionHeader title="Forms & Inputs" description="Inputs, selects, checkboxes, and other form controls." />

                <div className="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" placeholder="name@example.com" type="email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="disabled">Disabled Input</Label>
                            <Input id="disabled" disabled placeholder="Can't type here" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="with-icon">Input with Description</Label>
                            <Input id="with-icon" placeholder="Enter value" />
                            <p className="text-xs text-gray-500">We&apos;ll never share your data.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Slider</Label>
                            <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Option</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Date Picker</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Text Area</Label>
                            <Textarea placeholder="Type your message here." />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-3">
                                <Label>Checkboxes</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Accept terms
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="marketing" defaultChecked />
                                    <label
                                        htmlFor="marketing"
                                        className="text-sm font-medium leading-none"
                                    >
                                        Receive emails
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Radio Group</Label>
                                <RadioGroup defaultValue="option-one">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-one" id="option-one" />
                                        <Label htmlFor="option-one" className="font-normal">Option One</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-two" id="option-two" />
                                        <Label htmlFor="option-two" className="font-normal">Option Two</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards & Content */}
            <section id="cards">
                <SectionHeader title="Cards & Content" description="Containers for displaying content." />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Simple Card</CardTitle>
                            <CardDescription>A basic card with header.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Card content goes here. It provides a container for text, images, and actions.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Action</Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-t-4 border-t-chaiyo-gold shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-chaiyo-blue">Highlighted Card</CardTitle>
                            <CardDescription>With top border accent.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Used for emphasizing specific content or dashboard widgets.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-chaiyo-blue hover:bg-chaiyo-blue/90">Main Action</Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-chaiyo-blue text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-white">Dark Card</CardTitle>
                            <CardDescription className="text-blue-200">For colored backgrounds.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-blue-100">Content on dark backgrounds typically uses lighter text colors for contrast.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">Light Action</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Badges & Alerts */}
            <section id="feedback">
                <SectionHeader title="Feedback & Status" description="Badges, alerts, and notifications." />

                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-8">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Badges</h4>
                        <div className="flex flex-wrap gap-4">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Pending</Badge>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Alerts</h4>
                        <div className="space-y-4 max-w-2xl">
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Information</AlertTitle>
                                <AlertDescription>
                                    This is a standard informational alert using the default variant.
                                </AlertDescription>
                            </Alert>
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Your session has expired. Please log in again.
                                </AlertDescription>
                            </Alert>
                            <Alert variant="warning">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                    This action cannot be undone. Please proceed with caution.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section id="tabs">
                <SectionHeader title="Tabs" description="Switching between views." />

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <Tabs defaultValue="account" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Card className="shadow-none border-none mt-4 bg-gray-50">
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>
                                        Make changes to your account here. Click save when you&apos;re done.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="Pedro Duarte" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue="@peduarte" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <Card className="shadow-none border-none mt-4 bg-gray-50">
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving, you&apos;ll be logged out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="current">Current password</Label>
                                        <Input id="current" type="password" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="new">New password</Label>
                                        <Input id="new" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
