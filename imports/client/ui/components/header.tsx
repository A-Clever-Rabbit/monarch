import React from 'react';
import {NavLink} from 'react-router-dom'

const Header = () => {
  const navClasses = "flex gap-1 items-center"

  return <div className="bg-black text-white">
    <div className="flex justify-between items-center py-6 container">
      <span className="font-bold tracking-wide text-2xl">MONARCH REALM</span>

      <div className="flex gap-3 items-center">
        <NavLink className={navClasses} to="teams">
          Teams
        </NavLink>

        <NavLink className={navClasses} to="news">
          News
        </NavLink>

        <NavLink className={navClasses} to="quests">
          Quests
        </NavLink>

        <NavLink className={navClasses} to="teams">
          Realm+
        </NavLink>
      </div>
    </div>
  </div>
};

export default Header;
