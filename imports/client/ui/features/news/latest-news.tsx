import React from 'react';
import _ from 'lodash'
import {cn} from '@/lib/utils'
import {Button} from '@/components/button'
import {MoveRight} from 'lucide-react'

const LatestNews = () => {
  const news = ["Monarch x Cougar", "Monarch COD '24", "New RLCS Team"]

  return (
    <div className="grid grid-cols-2 gap-6">
      {_.map(news, (article, index) => {
        return <div key={article} className={cn("relative rounded-lg background-image text-white min-h-[320px]", index === 0 && "row-span-2")} style={{ backgroundImage: "url('/images/rocket_league.jpg')" }}>
          <div className="absolute inset-0 opacity-80 bg-gradient-to-t from-monarch-purple">

          </div>

          <div className="absolute inset-0 flex flex-col justify-between items-start p-4">
            <div className="bg-monarch-purple text-white px-4 py-1 rounded-full">
              New
            </div>

            <div className="flex flex-col items-start">
              <span className="text-5xl font-bold uppercase mb-4">{article}</span>
              <span className="mb-4">Check out the reveal of our partnership with Cougar Gaming</span>
              <Button type="button" variant="white"><span className="inline-block font-semibold mr-2">Watch now</span> <MoveRight /></Button>
            </div>
          </div>
        </div>
      })}
    </div>
  );
};

export default LatestNews;
