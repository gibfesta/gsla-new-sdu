import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/admin", destination: "/superuser/dashboard", permanent: false },
      { source: "/admin/dashboard", destination: "/superuser/reports/overview", permanent: false },
      { source: "/admin/superuser-dashboard", destination: "/superuser/dashboard", permanent: false },
      { source: "/admin/accounts", destination: "/finance/dashboard", permanent: false },
      { source: "/admin/sdu", destination: "/sports-development/dashboard", permanent: false },
      { source: "/admin/hr/:path*", destination: "/human-resources/:path*", permanent: false },
      { source: "/admin/human-resources/:path*", destination: "/human-resources/:path*", permanent: false },
      { source: "/admin/facilities/:path*", destination: "/facilities/facilities/:path*", permanent: false },
      { source: "/admin/bookings", destination: "/facilities/bookings", permanent: false },
      { source: "/admin/calendar", destination: "/facilities/shared-calendar", permanent: false },
      { source: "/admin/events/:path*", destination: "/facilities/events/:path*", permanent: false },
      { source: "/admin/sports/:path*", destination: "/sports-development/sports/:path*", permanent: false },
      { source: "/admin/sports-development-unit/:path*", destination: "/sports-development/sports/:path*", permanent: false },
      { source: "/admin/association/registration", destination: "/sports-development/associations/registration", permanent: false },
      { source: "/admin/form-b", destination: "/sports-development/associations/form-b", permanent: false },
      { source: "/admin/form-c", destination: "/sports-development/associations/form-c", permanent: false },
      { source: "/admin/forms", destination: "/sports-development/associations/forms", permanent: false },
      { source: "/admin/statistics", destination: "/sports-development/reports", permanent: false },
      { source: "/admin/manage/leagues/:path*", destination: "/sports-development/leagues/:path*", permanent: false },
      { source: "/admin/manage/teams/:path*", destination: "/sports-development/teams/:path*", permanent: false },
      { source: "/admin/manage/users/:path*", destination: "/superuser/users/:path*", permanent: false },
      { source: "/admin/manage/:path*", destination: "/superuser/system/manage/:path*", permanent: false },
      { source: "/admin/users/new", destination: "/superuser/users/new", permanent: false },
      { source: "/admin/profile", destination: "/profile", permanent: false },
      { source: "/admin/reminders", destination: "/superuser/system/reminders", permanent: false },
      { source: "/admin/mail", destination: "/superuser/system/mail", permanent: false },
      { source: "/admin/info", destination: "/superuser/system/info", permanent: false },
      { source: "/admin/import-export", destination: "/superuser/system/import-export", permanent: false },
      { source: "/auth/callback", destination: "/callback", permanent: false },
    ];
  },
};

export default nextConfig;
