import BoomerangVideoBg from '@/components/BoomerangVideoBg';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { SparklesBand } from '@/components/SparklesBand';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4';

export default function App() {
  return (
    <main className="relative flex min-h-[115vh] w-full flex-col items-center overflow-x-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* Fixed background footage. BoomerangVideoBg captures the clip and
          replays it forward/backward so the loop never cuts; if capture cannot
          complete it falls back to the plain looping <video>. */}
      <BoomerangVideoBg
        src={BG_VIDEO}
        className="fixed inset-0 z-0 h-full w-full"
        mediaClassName="h-full w-full object-cover"
      />

      {/* Legibility scrim over the footage */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80"
      />

      <Navbar />

      <div className="relative z-10 flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 sm:px-6">
        <Hero />
        <SparklesBand />
        <Footer />
      </div>
    </main>
  );
}
