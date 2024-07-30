import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link } from '@nextui-org/react';
import Queue from '../assets/queue2.png';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicRoutes } from '../models/Routes';


export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const isMM1Active = location.pathname === PublicRoutes.MM1;
	const isMM1NActive = location.pathname === PublicRoutes.MM1N;
	const isMM2Active = location.pathname === PublicRoutes.MM2;
	const isMG1Active = location.pathname === PublicRoutes.MG1;
	const isMMPActive = location.pathname === PublicRoutes.MMP;

	const menuItems = [
		'M/M/1',
		'M/M/1/N',
		'M/M/2',
		'M/G/1 & M/D/1',
		'M/M/P'
	];

	return (
		<Navbar shouldHideOnScroll isBordered onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent className='flex md:hidden'>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}

				/>
			</NavbarContent>

			<NavbarContent>
				<NavbarBrand className='justify-center md:justify-start'>
					<img src={Queue} className='max-w-16 max-h-16 ' />
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className='hidden md:flex gap-4' justify='center'>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MM1} color={isMM1Active ? 'primary' : 'foreground'} className={isMM1Active ? 'font-bold' : 'font-normal'}>
						M/M/1
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MM1N} color={isMM1NActive ? 'primary' : 'foreground'} className={isMM1NActive ? 'font-bold' : 'font-normal'}>
						M/M/1/N
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MM2} color={isMM2Active ? 'primary' : 'foreground'} className={isMM2Active ? 'font-bold' : 'font-normal'}>
						M/M/2
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MG1} color={isMG1Active ? 'primary' : 'foreground'} className={isMG1Active ? 'font-bold' : 'font-normal'}>
						M/G/1 & M/D/1
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link as={Link} href={PublicRoutes.MMP} color={isMMPActive ? 'primary' : 'foreground'} className={isMMPActive ? 'font-bold' : 'font-normal'}>
						M/M/P
					</Link>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu className='dark text-foreground bg-neutral-900'>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							color={(item === 'M/M/1' && isMM1Active) ? 'primary' : (item === 'M/M/1/N' && isMM1NActive) ? 'primary' : (item === 'M/M/2' && isMM2Active) ? 'primary' : (item === 'M/G/1' && isMG1Active) ? 'primary' : 'foreground'}
							className='w-full'
							href={item === 'M/M/1' ? PublicRoutes.MM1 : item === 'M/M/1/N' ? PublicRoutes.MM1N : item === 'M/M/2' ? PublicRoutes.MM2 : PublicRoutes.MG1}
							size='lg'
						>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	)
}
