import { formatNumber } from '@/lib/utils';
import GoldMedalIcon from '@/assets/icons/gold-medal.svg';
import SilverMedalIcon from '@/assets/icons/silver-medal.svg';
import BronzeMedalIcon from '@/assets/icons/bronze-medal.svg';
import Image from 'next/image';
import { BadgeCounts } from '@/types';

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({imgUrl, value, title}: StatsCardProps) => {
  return (
    <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-[8px] border p-6 shadow-light-300 dark:shadow-dark-200'>
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <p className='paragraph-semibold text-dark200_light900'>{value}</p>
        <p className='body-medium text-dark400_light700'>{title}</p>
      </div>
    </div>
  )
}

interface StatsProps {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCounts;
  reputation: number;
}

const Stats = ({ reputation, totalQuestions, totalAnswers, badges }: StatsProps) => {
  return (
    <div className="mt-10">
      <h4 className='h3-semibold text-dark200_light900'>Stats - {reputation}</h4>

      <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
        <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-[8px] border p-6 shadow-light-300 dark:shadow-dark-200'>
            <div>
                <p className='paragraph-semibold text-dark200_light900'>
                    {formatNumber(totalQuestions)}
                </p>
                <p className='body-medium text-dark400_light700'>Questions</p>
            </div>
            <div>
                <p className='paragraph-semibold text-dark200_light900'>
                    {formatNumber(totalAnswers)}
                </p>
                <p className='body-medium text-dark400_light700'>Answers</p>
            </div>
        </div>

        <StatsCard imgUrl={GoldMedalIcon} value={badges.GOLD} title="Gold Badges" />
        <StatsCard imgUrl={SilverMedalIcon} value={badges.SILVER} title="Silver Badges" />
        <StatsCard imgUrl={BronzeMedalIcon} value={badges.BRONZE} title="Bronze Badges" />
      </div>
    </div>
  )
}

export default Stats
