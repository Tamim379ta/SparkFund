# SparkFund - Crowdfunding Platform (Client)

SparkFund is a community-powered crowdfunding platform where creators launch campaigns and supporters back what matters most to them. Built with Next.js, Tailwind CSS, and HeroUI.

## 🔗 Live Site
[click here](https://spark-fund-lime.vercel.app)

## 🔐 Admin Credentials
- **Email:** admin@gmail.com
- **Password:** 12345678

## ✨ Features

- **Three-Role System:** Supporter, Creator, and Admin roles with tailored dashboards and permissions
- **Credit Economy:** Supporters purchase credits ($1 = 10 credits) and use them to back campaigns
- **Stripe Payments:** Secure credit purchases with 4 packages ($10, $25, $60, $110)
- **Campaign Management:** Creators can create, update, and delete campaigns with imgBB image uploads
- **Contribution Flow:** Supporters contribute credits, creators approve or reject, with automatic refunds on rejection
- **Withdrawal System:** Creators withdraw raised credits as cash (20 credits = $1, minimum 200 credits)
- **Admin Controls:** Approve or reject campaigns, manage users and roles, process withdrawals, resolve reports
- **Notification System:** Real-time in-app notifications for all key actions across all three roles
- **Explore & Search:** Browse active campaigns with search, category filter, and pagination
- **Responsive Design:** Fully responsive across mobile, tablet, and desktop including dashboards

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS v4
- HeroUI v3
- Better Auth
- Framer Motion
- Stripe
- imgBB
- react-fast-marquee
- Swiper

## 📦 Installation

```bash
git clone https://github.com/Tamim379ta/SparkFund.git
cd SparkFund
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
BETTER_AUTH_SECRET=your_secret
```

```bash
npm run dev
```

## 📁 Project Structure

```
src/
  app/
    (auth)/        # Login & Register pages
    (main)/        # Home, Explore, Campaign Detail
    dashboard/     # Role-based dashboards
  components/
    home/          # Home page sections
    shared/        # Navbar, Footer
    dashboard/     # Notification bell
    campaign/      # Campaign detail, Report modal
    ui/            # Reusable FadeIn animation
  lib/
    auth-client.js # Better Auth client
```
