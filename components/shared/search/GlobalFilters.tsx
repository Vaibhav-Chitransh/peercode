"use client"
import { GlobalSearchFilters } from '@/constants/filters'
import { formURLQuery } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const GlobalFilters = () => {
    const router =useRouter();
    const searchParams =useSearchParams();
    const typeParams =searchParams.get('type');
    const [active,setActive]=useState(typeParams || '');

    
      const handleTypeClick = ( item: string)=>{
         if (active === item) {
          setActive("");
              const newUrl = formURLQuery({
                params: searchParams.toString(),
                key: 'type',
                value: null,
              });
              router.push(newUrl, { scroll: false });
            } else {
              setActive(item);
              const newUrl = formURLQuery({
                params: searchParams.toString(),
                key: 'type',
                value: item.toLowerCase(),
              });
              router.push(newUrl, { scroll: false });
            } 
        }

     
  return (
    <div className='flex items-center gap-5 px-5'>
        <p className='text-dark400_light900 body-medium'>Type: </p>
        <div className='flex gap-3'>
            {GlobalSearchFilters.map((item)=>(
                <button
                    type='button'
                    key={item.value}
                    className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize 
                        dark:text-light-800 dark:hover:text-primary-500 
                        ${active === item.value
                            ? 'bg-primary-500 text-light-900'
                            :'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'
                        }
                        `}
                    onClick={()=> handleTypeClick(item.value)}
                >
                    {item.value}
                </button>
            ))}
        </div>
    </div>
  )
}

export default GlobalFilters