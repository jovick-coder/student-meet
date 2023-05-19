import Link from "next/link";
import Card from "./Card";
import { AiOutlineHome } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { BsPeople, BsBookmarks } from 'react-icons/bs'
import { IoMdNotificationsOutline, IoMdLogOut } from 'react-icons/Io'
import { useRouter } from "next/router";

export default function NavigationCard() {

    const router = useRouter();
    const {pathname} = router;

    const activeElementClasses = 'hover:font-bold text-sm md:text-md flex gap-1 md:gap-3 py-3 my-1 bg-socialBlue text-white md:-mx-7 px-6 md:px-7 rounded-md shadow-md shadow-gray-300 items-center';
    const nonActiveElementClasses = 'hover:font-bold text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 md:-mx-4 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center';

    return (
        <Card>
        <div className='px-4 py-2'>
            <h2 className='text-gray-400 mb-3'>Navigation</h2>
                <Link href={'/'}>
                    <span className={pathname === '/' ? activeElementClasses : nonActiveElementClasses}><AiOutlineHome />Home</span>
                </Link>
                
                <Link href={'/profile'}>
                <span className={pathname === '/profile' ? activeElementClasses : nonActiveElementClasses}><CgProfile />Profile</span>
                </Link>

                <a href="" className={nonActiveElementClasses}><BsPeople />Friends</a>
                <a href="" className={nonActiveElementClasses}><BsBookmarks />Saved posts</a>
                <a href="" className={nonActiveElementClasses}><IoMdNotificationsOutline />Notifications</a>
                <a href="" className={nonActiveElementClasses}><IoMdLogOut />Logout</a>
        </div>
        </Card>
    )
}
