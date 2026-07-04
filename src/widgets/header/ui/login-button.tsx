import { Link } from '@tanstack/react-router';

export default function LoginButton() {
  return (
    <Link
      to="/riot"
      className="mobile: mx-auto my-0 cursor-pointer bg-transparent px-0 text-sm font-bold text-violet-600 mobile:rounded-md mobile:bg-violet-600 mobile:px-6 mobile:py-2 mobile:text-lg mobile:font-bold mobile:text-white"
    >
      로그인
    </Link>
  );
}
