import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Bell, Globe, Moon, Shield, Sun, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  
  // Mock Settings State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('english');
  const [publicProfile, setPublicProfile] = useState(false);

  const handleSavePreferences = () => {
    toast.success('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    // In a real app, you'd show a confirmation modal first
    toast.error('Account deletion requested. Please contact support.');
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p>Please log in to view settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">App Settings</h1>
          <p className="text-gray-600">Customize your dining experience preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how we contact you about orders & promotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive live updates for your orders</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}
                  onClick={() => setPushEnabled(!pushEnabled)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Offers</Label>
                  <p className="text-sm text-gray-500">Get discounted deals in your inbox</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}
                  onClick={() => setEmailEnabled(!emailEnabled)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance & Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                Preferences
              </CardTitle>
              <CardDescription>Adjust the visual theme and language of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme Mode</Label>
                  <p className="text-sm text-gray-500">Switch between light and dark visuals</p>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                   <button
                     onClick={() => setIsDarkMode(false)}
                     className={`p-2 rounded-md flex items-center gap-2 transition-colors ${!isDarkMode ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                   >
                     <Sun className="h-4 w-4" /> <span className="text-sm font-medium">Light</span>
                   </button>
                   <button
                     onClick={() => setIsDarkMode(true)}
                     className={`p-2 rounded-md flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-gray-800 text-white shadow' : 'text-gray-500'}`}
                   >
                     <Moon className="h-4 w-4" /> <span className="text-sm font-medium">Dark</span>
                   </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Language</Label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md bg-white border"
                >
                  <option value="english">English (US)</option>
                  <option value="spanish">Español</option>
                  <option value="french">Français</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Privacy
              </CardTitle>
              <CardDescription>Control your data visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Make Profile Public</Label>
                  <p className="text-sm text-gray-500">Allow restaurants to see your dining history</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${publicProfile ? 'bg-orange-500' : 'bg-gray-200'}`}
                  onClick={() => setPublicProfile(!publicProfile)}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${publicProfile ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4 pb-8">
            <Button
              onClick={handleSavePreferences}
              className="bg-orange-500 hover:bg-orange-600 px-8"
            >
              Save Preferences
            </Button>
          </div>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription className="text-red-600/80">Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between">
                 <div className="space-y-1 text-red-900">
                   <p className="font-medium">Delete Account</p>
                   <p className="text-sm text-red-700/80">Permanently delete your account and all associated data</p>
                 </div>
                 <Button variant="destructive" onClick={handleDeleteAccount}>
                   <Trash2 className="h-4 w-4 mr-2" />
                   Delete Account
                 </Button>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
