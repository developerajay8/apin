export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
   <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
  <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
    Profile page
  </h1>

  <h2 className="mt-5 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg backdrop-blur-xl break-all">
    {id}
  </h2>
</div>

  );
}
