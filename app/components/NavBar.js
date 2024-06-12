'use client';
import Link from 'next/link';
import styled from '@emotion/styled';

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #333;
  padding: 1rem;
  color: white;
  text-decoration: none;
`;
const NavLink = styled.span`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
export default function NavBar() {
  return (
    <Nav>
      <Link href='/' passHref>
        <NavLink>Home</NavLink>
      </Link>
      <Link href='/templatePage/1' passHref>
        <NavLink>1</NavLink>
      </Link>
      <Link href='/templatePage/2' passHref>
        <NavLink>2</NavLink>
      </Link>
      <Link href='/templatePage/3' passHref>
        <NavLink>3</NavLink>
      </Link>
      <Link href='/templatePage/4' passHref>
        <NavLink>4</NavLink>
      </Link>
      <Link href='/templatePage/5' passHref>
        <NavLink>5</NavLink>
      </Link>
    </Nav>
  );
}
