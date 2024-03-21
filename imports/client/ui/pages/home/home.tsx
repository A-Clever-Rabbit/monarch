import React from 'react';
import LatestNews from '@/features/news/latest-news'

const Home = () => {
  return <div>
    <div className="py-6">
      Header
    </div>
    <div className="background-image main">

    </div>

    <div className="bg-monarch-charcoal">
      <div className="container py-20">
        <LatestNews/>
      </div>
    </div>

    <div className="bg-black">
      <div className="container mx-auto pb-20">
        <div className="text-center pt-20 pb-12">
          <p className="text-2xl text-white font-acto font-bold">ABOUT <span className="text-monarch-gold">MONARCH REALM</span></p>
        </div>

        <div className="text-center">
          <p className="text-2xl text-white font-acto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab autem dignissimos doloribus earum esse ex
            excepturi nesciunt odit reiciendis, saepe. Alias blanditiis delectus fugit id illo laudantium, praesentium
            quia vitae.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, assumenda at aut blanditiis, cumque
            dignissimos dolor doloremque dolorum illum ipsum iste labore laborum minus nobis numquam omnis quia quo
            suscipit!
          </p>
        </div>
      </div>
    </div>

    {/*<HomepageRecentMatchups />*/}

    {/*<HomepageUpcomingMatches />*/}

    <div className="bg-monarch-charcoal">
      <div className="container mx-auto py-40">
        <div className="flex justify-around items-center h-full">
          <div>
            Slayer Logo
          </div>

          <div>
            Cougar
          </div>
        </div>
      </div>
    </div>

    <div className="py-6">
      Footer
    </div>
  </div>
};

export default Home;
