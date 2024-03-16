import React from 'react';

const Home = () => {
  return <div>
    <div className="background-image main">

    </div>
    <div className="bg-monarch-charcoal">
      <div className="container mx-auto pb-20">
        <div className="text-center pt-20 pb-12">
          <p className="text-2xl text-white font-acto font-bold">Teams</p>
        </div>
        <div className="md:flex md:justify-between md:gap-12">
          <HomePageTeamCard name="Staff" imageURL="/images/staff.jpg" />
          <HomePageTeamCard name="Rocket League" imageURL="/images/rocket_league.jpg" />
          <HomePageTeamCard name="Call of Duty" imageURL="/images/call_of_duty.jpg" />
        </div>
      </div>
    </div>

    <div className="bg-monarch-gold">
      <div className="container mx-auto pb-20">
        <div className="text-center pt-20 pb-12">
          <p className="text-2xl text-monarch-charcoal font-acto font-bold">ABOUT MONARCH REALM</p>
        </div>

        <div className="text-center">
          <p className="text-2xl text-monarch-charcoal font-acto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab autem dignissimos doloribus earum esse ex excepturi nesciunt odit reiciendis, saepe. Alias blanditiis delectus fugit id illo laudantium, praesentium quia vitae.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, assumenda at aut blanditiis, cumque dignissimos dolor doloremque dolorum illum ipsum iste labore laborum minus nobis numquam omnis quia quo suscipit!
          </p>
        </div>
      </div>
    </div>

    {/*<HomepageRecentMatchups />*/}

    {/*<HomepageUpcomingMatches />*/}

    <div className="bg-white">
      <div className="container mx-auto py-40">
        <div className="text-center">
          <span className="text-monarch-charcoal text-5xl font-bold">MERCH COMING SOON...</span>
        </div>
      </div>
    </div>
  </div>
};

export default Home;

const HomePageTeamCard = ({ name, imageURL }) => {
  return <div className="homepage-team-card" style={{backgroundImage: `url(${imageURL})`}}>
    <span className="team-name">{name}</span>
  </div>
}
