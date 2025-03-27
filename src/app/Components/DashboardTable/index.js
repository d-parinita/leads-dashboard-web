'use client'
import React, { useState, useEffect } from 'react';
import { CustomTable } from '../CustomTable';
import { columns } from '@/app/utils/constVariables';
import { getPosts } from '@/app/apiService';
import { AiOutlineSearch } from "react-icons/ai";
import { toast } from 'react-toastify';
import { useLoader } from '@/app/context/LoaderContext';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

export default function DashboardTable({ initialPosts = [] }) {

  const { theme, setTheme } = useTheme()
  const { setLoading } = useLoader()

  const [myTheme, setMyTheme] = useState(null)
  const [postData, setPostData] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiCalled, setApiCalled] = useState(false)
  const itemsPerPage = 5;

  useEffect(() => {
    if (initialPosts.length === 0 && !apiCalled) {
      setApiCalled(true)
      async function loadInitialData() {
        setLoading(true)
        try {
          const data = await getPosts();
          setPostData(data);
        } catch (err) {
          toast.error('API Failed');
        } finally {
          setLoading(false)
        }
      }

      loadInitialData();
    }
  }, [initialPosts, apiCalled]);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setMyTheme(savedTheme)
  }, [theme])

  const handleFilter = async () => {
    if (filterBy == "") {
      return
    }
    if (!search || !filterBy) {
      setLoading(true);
      const initialData = await getPosts();
      setPostData(initialData);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let query = filterBy + '=' + search;
      const data = await getPosts(query);
      setPostData(data);
    } catch (err) {
      toast.error('API Failed');
    } finally {
      setLoading(false);
    }
  };

  const sortInAscending = () => {
    const allpost = [...postData]
    allpost.sort((a, b) => {return a.id - b.id})
    setPostData(allpost)       
  }

  const sortInDescending = () => {
    const allpost = [...postData]
    allpost.sort((a, b) => {return b.id - a.id})
    setPostData(allpost) 
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search || filterBy) {
        handleFilter();
      }
    }, 800); 
  
    return () => {
      clearTimeout(handler); 
    };
  }, [search, filterBy]); 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = postData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(postData.length / itemsPerPage);

  return (
    <div className='mt-18 mx-5'>
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 w-full max-w-3xl">
        <div className='flex sm:flex-1 gap-4'>
          <span className="relative flex sm:flex-1">
            <AiOutlineSearch className="absolute left-3 top-2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="sm:w-full w-[180px] pl-10 pr-4 py-1 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </span>

          <select 
            onChange={(e) => setFilterBy(e.target.value)} 
            className={`border rounded-lg py-1 bg-[#000] px-3 focus:outline-none focus:ring-2 focus:ring-gray-700 ${myTheme == 'dark' ? 'bg-[#010000]' : 'bg-white'}`}
          >
            <option value="">Filter By</option>
            <option value="userId">User Id</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className='flex items-center'>
          <span className='font-medium'>Sort by Id:</span>
          <Button onClick={sortInAscending} size={'sm'} className={'ml-2'}><FaArrowUp/></Button>
          <Button onClick={sortInDescending} size={'sm'} className={'ml-2'}><FaArrowDown/></Button>
        </div>
      </div>
      
      {currentItems.length > 0 ? (
        <>
          <CustomTable data={currentItems} columns={columns} />
          <div className="flex justify-center items-center mt-40">
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="px-3 py-1 text-xs font-medium border disabled:cursor-not-allowed border-gray-300 mx-1 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-2 text-xs font-medium">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="px-3 py-1 text-xs font-medium border disabled:cursor-not-allowed border-gray-300 mx-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 text-center">No data available</div>
      )}
    </div>
  );
}