import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/common/Avatar';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ full_name: fullName, bio }),
      });
      if (res.ok) {
        toast.success('Profile updated!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      if (res.ok) {
        toast.success('Password changed!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Failed to change password');
      }
    } catch {
      toast.error('Failed to change password');
    }
  };

  const handleDeleteAccount = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Profile</h1>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <Avatar src={user?.avatar_url || null} name={user?.full_name || 'User'} size="xl" />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>{user?.full_name}</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>@{user?.username}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
              Member since {user?.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: 16, backgroundColor: 'var(--color-bg-dark)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: 24, fontWeight: 700 }}>{user?.trip_count || 0}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Trips</p>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Edit Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <TextArea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500} showCount />
          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Change Password</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Current Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </Card>

      <Card style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--color-error)' }}>Danger Zone</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 16 }}>
          Once you delete your account, there is no going back.
        </p>
        <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>Delete Account</Button>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted."
        confirmText="Delete Forever"
        confirmVariant="danger"
      />
    </div>
  );
}
