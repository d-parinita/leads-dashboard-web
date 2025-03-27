import React from 'react'
import Layout from "@/app/Components/Layout";
import DashboardTable from '@/app/Components/DashboardTable';
import { getPosts } from '@/app/apiService';

export default async function Page() {

  const initialPosts = await getPosts();

  return (
    <>
       <Layout>
            <DashboardTable initialPosts={initialPosts}/>
        </Layout> 
    </>
  )
}
