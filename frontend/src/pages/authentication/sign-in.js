import SignInForm from '@/components/Authentication/SignInForm';
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from 'next-auth';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default function SignIn() {
  return (
    <>
      <SignInForm />
    </>
  );
}
