import { Button, Td, Tr } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { Lecture } from "../../types";

interface LectureTableProps {
  id: string;
  grade: number;
  title: string;
  credits: string;
  major: string;
  schedule: string;
  lecture: Lecture;
  addSchedule: (lecture: Lecture) => void;
}

const LectureTable = React.memo(
  ({
    id,
    grade,
    title,
    credits,
    major,
    schedule,
    lecture,
    addSchedule,
  }: LectureTableProps) => {
    const onClickAddSchedule = useCallback(() => {
      addSchedule(lecture);
    }, [addSchedule, lecture]);
    return (
      <Tr>
        <Td width="100px">{id}</Td>
        <Td width="50px">{grade}</Td>
        <Td width="200px">{title}</Td>
        <Td width="50px">{credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={onClickAddSchedule}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);

export default LectureTable;
