import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";
export default async function AwaitingVenuePage() {
 const { user, roles } = await getAccess();
 if (!user) redirect("/sign-in");
 if (roles.includes("organisation_admin")) redirect("/organisation/home");
 if (roles.includes("facilities_admin")) redirect("/facilities/home");
 if (!roles.includes("centre_manager")) redirect("/access-denied");
 return <main className="min-h-screen bg-[#f5f9ff] flex items-center justify-center p-6">
  <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-[#d5e4f6] shadow-sm">
   <header className="bg-[#123c69] p-7 text-white"><p className="text-xs uppercase tracking-widest text-blue-100">GSLA WebApp</p><h1 className="text-xl font-bold mt-1">Centre Manager Portal</h1></header>
   <div className="p-8 text-center">
    <div className="mx-auto h-16 w-16 rounded-2xl bg-[#eef5fd] flex items-center justify-center text-3xl">⌛</div>
    <h2 className="mt-6 text-2xl font-bold text-[#153763]">Awaiting Venue Assignment</h2>
    <p className="mt-4 text-[#526f98]">Your account is active, but you have not yet been assigned a venue.</p>
    <p className="mt-3 text-sm leading-6 text-[#526f98]">Please contact the Facilities Department to arrange your venue assignment. Once assigned, you will be able to access your Centre Manager workspace.</p>
    <div className="mt-7 rounded-xl bg-[#f5f9ff] border border-[#d5e4f6] p-4 text-left text-sm text-[#153763]">
      <p>✓ Account verified</p><p className="mt-2">○ Venue assignment pending</p>
    </div>
   </div>
  </section>
 </main>;
}
