"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: "",
    email: "",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit settings data to backend or handle as needed
    console.log("Settings submitted:", settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your company information and notification preferences
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        <div className="grid gap-2">
          <Label htmlFor="companyName" className="text-sm sm:text-base">
            Company Name
          </Label>
          <Input
            id="companyName"
            value={settings.companyName}
            onChange={(e) =>
              setSettings({ ...settings, companyName: e.target.value })
            }
            className="text-sm sm:text-base"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm sm:text-base">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) =>
              setSettings({ ...settings, email: e.target.value })
            }
            className="text-sm sm:text-base"
          />
        </div>

        <div className="grid gap-3 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            Notification Preferences
          </h3>

          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm sm:text-base">Email Notifications</Label>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked: boolean) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    email: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm sm:text-base">SMS Notifications</Label>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked: boolean) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    sms: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm sm:text-base">Push Notifications</Label>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked: boolean) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    push: checked,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3"
      >
        Save Settings
      </Button>
    </form>
  );
}
