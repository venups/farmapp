import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import { toast } from 'react-hot-toast';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const profile = {
    full_name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatar_url: null,
    bio: 'Travel enthusiast and photographer.',
    created_at: '2024-01-15T00:00:00Z',
    trip_count: 12,
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Saving profile...');
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Changing password...');
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Password changed successfully!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card padding="lg" className="flex flex-col md:flex-row items-center gap-6">
        <Avatar src={profile.avatar_url} name={profile.full_name} size="xl" />
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
          <p className="text-slate-400 mb-2">@{profile.username}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-indigo-400 font-semibold">{profile.trip_count}</span>
              <span className="text-slate-400 ml-1">Trips</span>
            </div>
            <div>
              <span className="text-slate-400">Member since</span>
              <span className="ml-1">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline">Edit Profile</Button>
      </Card>

      {/* Edit Profile Section */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={profile.full_name}
              className="w-full px-4 py-2 rounded-lg border bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              className="w-full px-4 py-2 rounded-lg border bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
            <textarea
              rows={4}
              defaultValue={profile.bio}
              className="w-full px-4 py-2 rounded-lg border bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 border-slate-600"
            />
          </div>

          <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Section */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
            <input
              type="password"
              placeholder="Enter your current password"
              className="w-full px-4 py-2 rounded-lg border bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              className="w-full px-4 py-2 rounded-lg border bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              className="w-full px-4 py-2 rounded-lg border bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 border-slate-600"
            />
          </div>

          <div className="flex justify-end">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Change Password
              </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card padding="lg" className="border-red-500/30 bg-red-950/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <p className="text-slate-300 mb-6">
            Deleting your account will permanently remove all your data. This action cannot be undone.
          </p>

          <Button variant="danger" onClick={() => console.log('Delete account')}>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
