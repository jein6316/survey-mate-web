"use client";
import { useState } from "react";
import { Input } from "@/app/component/common/list/ListInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/component/common/list/Select";
import { ListButton } from "@/app/component/common/list/ListButton";
import { DatePicker } from "@/app/component/common/list/DatePicker"; // 커스텀 DatePicker 컴포넌트 사용 가정
import { Card, CardContent } from "@/app/component/common/list/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/component/common/list/Table";

const SurveyListPage = () => {
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [surveyType, setSurveyType] = useState("모든 설문");

  const [surveys, setSurveys] = useState([]);

  const handleSearch = () => {
    // 여기에 API 호출 또는 필터링 로직 구현
    console.log({ searchType, searchKeyword, startDate, endDate, surveyType });
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="creator">생성자</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어 입력"
              />
            </div>

            <div className="flex items-center gap-2">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="시작일"
              />
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="종료일"
              />
            </div>

            <div>
              <Select value={surveyType} onValueChange={setSurveyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="모든 설문">모든 설문</SelectItem>
                  <SelectItem value="normal">일반 설문</SelectItem>
                  <SelectItem value="group">그룹 설문</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ListButton onClick={handleSearch}>검색</ListButton>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>생성일시</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>그룹설문여부</TableHead>
                <TableHead>생성자</TableHead>
                <TableHead>수정일시</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{survey.createdAt}</TableCell>
                  <TableCell>{survey.title}</TableCell>
                  <TableCell>
                    {survey.isGroup ? "그룹설문" : "일반설문"}
                  </TableCell>
                  <TableCell>{survey.creator}</TableCell>
                  <TableCell>{survey.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyListPage;
