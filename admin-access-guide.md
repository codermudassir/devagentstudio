# Admin Access Guide

This guide provides information on how to access the admin panel and manage user roles.

## Access URL
The admin panel is accessible at:
[https://fvgbgyzyrwrsnoyuxkdv.supabase.co/admin](https://fvgbgyzyrwrsnoyuxkdv.supabase.co/admin)
(Or `/admin` on your local/production domain)

## Default Admin Accounts
The following emails are configured as admins in the system:
- `Mudassir@admin.com`
- `devmudassir@gmail.com`
- `devmudassir5@gmail.com`

> [!NOTE]
> Passwords are managed by Supabase Auth. If you do not have the password for these accounts, you can reset them in the Supabase Dashboard.

## How to Make Any User an Admin
To grant admin access to any user, run the following SQL command in the [Supabase SQL Editor](https://supabase.com/dashboard/project/fvgbgyzyrwrsnoyuxkdv/sql/new):

```sql
UPDATE public.profiles 
SET role = 'admin', 
    plan = 'enterprise', 
    credits = 9999 
WHERE email = 'YOUR_EMAIL@example.com';
```

Replace `YOUR_EMAIL@example.com` with the actual email of the user you want to elevate.

## Admin Features
Once logged in as an admin, you have full control over:
- **User Management**: Edit profiles, adjust credits, and delete users.
- **CRM / Activity**: Monitor user actions and platform events.
- **Pricing Plans**: Configure subscription tiers and features.
## Troubleshooting: Redirected to /dashboard?
If you are being redirected from `/admin` to `/dashboard`, it means your account does not have the `admin` role in the `profiles` table.

### 1. Check your current role
Run this in the [Supabase SQL Editor](https://supabase.com/dashboard/project/fvgbgyzyrwrsnoyuxkdv/sql/new) to see your current status:

```sql
SELECT email, role, plan FROM public.profiles WHERE email = 'YOUR_EMAIL@example.com';
```

### 2. Force Admin Role
If the role is not `admin`, run this command:

```sql
UPDATE public.profiles 
SET role = 'admin', 
    plan = 'enterprise', 
    credits = 9999 
WHERE email = 'YOUR_EMAIL@example.com';
```

### 3. Ensure Profiles Table Exists
If you get an error that the `profiles` table does not exist, you must run the initial setup script provided in [RUN_THIS_IN_SUPABASE.sql](file:///d:/Other%20works/talha/mydevagents/RUN_THIS_IN_SUPABASE.sql).
