import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">About Kheyma</h1>
        <div className="space-y-6 text-lg">
          <p>
            Kheyma is Egypt's premier platform for discovering and booking unique camping experiences. We connect
            nature lovers with authentic, safe, and breathtaking camping destinations across Egypt.
          </p>
          <p>
            From the White Desert to the Red Sea, we've curated a collection of verified campsites that offer
            everything from traditional Bedouin experiences to modern glamping retreats.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

