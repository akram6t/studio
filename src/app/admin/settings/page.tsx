"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Bell, 
  ShieldCheck, 
  Globe, 
  Save, 
  Mail, 
  Smartphone,
  Database,
  Lock,
  Eye,
  Trash2
} from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">System Settings</h1>
          <p className="text-muted-foreground text-sm">Configure your platform preferences and global parameters.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-background border h-12 p-1 gap-1 mb-8">
          <TabsTrigger value="general" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShieldCheck className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Database className="h-4 w-4" /> Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Platform Branding</CardTitle>
              <CardDescription>Update your site name, logo, and primary contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="Logical Book" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" defaultValue="support@logicalbook.com" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Global Meta Description</Label>
                <Input id="siteDescription" defaultValue="The ultimate destination for logical exam preparation." className="rounded-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Mode</CardTitle>
              <CardDescription>Temporarily disable public access during system updates.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between p-6 bg-muted/20 rounded-xl m-6">
              <div className="space-y-1">
                <p className="font-bold text-sm">Enable Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">This will show a temporary landing page to all non-admin users.</p>
              </div>
              <Switch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be alerted about platform activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Email Alerts</p>
                    <p className="text-xs text-muted-foreground">Receive weekly reports and security notices via email.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Get real-time alerts on your mobile device for high-priority events.</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
              <CardDescription>Configure authentication and data protection policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-muted-foreground">Enforce 2FA for all administrator accounts.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Session Timeout</p>
                    <p className="text-xs text-muted-foreground">Automatically log out inactive administrators after 30 minutes.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive/10">
                  <Lock className="h-4 w-4" />
                  Reset Admin Passwords
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-none shadow-sm bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>Critical actions that may lead to permanent data loss.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-destructive/20 rounded-xl bg-white dark:bg-card">
                <div>
                  <p className="text-sm font-bold">Clear System Cache</p>
                  <p className="text-xs text-muted-foreground">Refresh all static content and pre-computed analytics.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">Run Now</Button>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-destructive/20 rounded-xl bg-white dark:bg-card">
                <div>
                  <p className="text-sm font-bold">Delete Test Logs</p>
                  <p className="text-xs text-muted-foreground">Permanently remove user attempt history older than 1 year.</p>
                </div>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 rounded-lg gap-2">
                  <Trash2 className="h-4 w-4" /> Delete Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
