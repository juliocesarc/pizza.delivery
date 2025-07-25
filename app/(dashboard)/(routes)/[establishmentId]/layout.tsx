import Navbar from '@/components/navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
/*   const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  } */

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};