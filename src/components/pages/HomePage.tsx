/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect, useState } from "react";
import useFetch from "../../custom-hooks/useFetch";
import { Course, backendSuccessResponse } from "../../types/types";
import SearchBar from "../reusable/searchBar/SearchBar.tsx";
import CourseList from "../reusable/course/CourseList";
import { CourseContext } from "../../context/CourseContext";
import { Button } from "reactstrap";
import AddModal from "../reusable/modal/AddModal.tsx";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { courseSetters, courses } = useContext(CourseContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const data = useFetch<backendSuccessResponse<Course[]>>({
    endpoint: "course/getAllCourses",
  });
  useEffect(() => {
    console.log(data);
    if (data.state === "complete" && Array.isArray(data.response?.response)) {
      courseSetters?.setCourses(data.response?.response as Course[]);
    }
  }, [data.state]);
  let result;
  if (data.state === "loading") {
    result = <div>Loading...</div>;
  }

  if (data.state === "error" && data.errorMessage) {
    result = <div>{data.errorMessage}</div>;
  }

  if (courses.length === 0) {
    result = (
      <div className="flex items-center justify-center w-full text-gray-800">
        No courses found!
      </div>
    );
  }

  return (
    <main className="relative flex flex-col py-10 sm:flex-row">
      <div className="absolute flex gap-2 top-[-4px] left-4">
        <Link to="bulkInsert">
          <Button color="primary">Bulk Insert</Button>
        </Link>
        <Button onClick={() => setShowAddModal(true)}>Add Course ➕</Button>
      </div>
      <SearchBar />
      {result || <CourseList courses={courses}></CourseList>}
      <AddModal show={showAddModal} setShow={setShowAddModal}></AddModal>
    </main>
  );
}
