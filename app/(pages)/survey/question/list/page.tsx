"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query"; // or the appropriate library
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
import { Pagination } from "@/app/component/common/list/Pagination";
import {
  APIResponse,
  SurveyQuestionMstRequest,
  SurveyQuestionMstResponse,
} from "@/app/types/apiTypes";
import { getCreatedSurveyList } from "@/app/api/survey/surveyApi"; // API 호출 함수
import { parseDateArrayToStringWithoutLast } from "@/app/utils/formatter";
import { useRouter } from "next/navigation"; // next/navigation에서 useRouter, usePathname 사용
import { formatDateStartEndDate } from "@/app/utils/formatter";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import { useRecoilValue } from "recoil";

export default function SurveyListPage() {
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [surveyType, setSurveyType] = useState("모든 설문");
  const [page, setPage] = useState(1); // 현재 페이지 (1부터 시작)
  const [pageSize, setPageSize] = useState(10); // 한 페이지당 아이템 수
  const [surveyTotalCount, setSurveyTotalCount] = useState(0); // 전체 아이템 수
  const [selectedValue, setSelectedValue] = useState("모든 설문");
  const [surveys, setSurveys] = useState([]);
  const { groupId } = useRecoilValue(userAtom); // 그룹 ID
  const router = useRouter(); // next/navigation에서 useRouter 사용

  const handleSearch = () => {
    // SurveyQuestionMstRequest 형식으로 변환
    const surveyData: SurveyQuestionMstRequest = {
      title: searchKeyword,
      startDate: startDate
        ? formatDateStartEndDate(startDate, false)
        : undefined, // 시작일을 ISO 문자열로 변환
      endDate: endDate ? formatDateStartEndDate(endDate, true) : undefined, // 종료일을 ISO 문자열로 변환
      groupId: selectedValue == "group" ? groupId : undefined, // 그룹 설문 여부
    };
    if (isValid()) {
      mutate({
        ...surveyData,
        page: page - 1, // 페이지는 0부터 시작하므로 -1
        size: pageSize,
      });
    }
  };
  //validation check
  const isValid = () => {
    return true; // 여기에 유효성 검사 로직 추가
  };

  // API 호출 로직
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    SurveyQuestionMstRequest
  >({
    mutationFn: getCreatedSurveyList,
    onSuccess: (data: any) => {
      setSurveys(data.data.content || []); // 데이터를 상태에 저장
      setSurveyTotalCount(data.totalCount || 0); // 전체 아이템 수 저장
    },
    onError: (error: Error) => {
      console.error("API 호출 중 오류 발생:", error);
    },
  });

  useEffect(() => {
    // API 호출 예시
    mutate({
      page: page - 1, // 페이지는 0부터 시작하므로 -1
      size: pageSize,
    } as SurveyQuestionMstRequest);
  }, [mutate, page, pageSize]);

  const handleClickTitle = (mstId: string) => {
    debugger;
    const url = `/survey/question/list/responses/?sqMstId=${mstId}`;
    router.push(url);
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                제목
              </span>
              <Input
                className="w-auto"
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
              <Select
                value={selectedValue}
                onValueChange={(v) => setSelectedValue(v)}
              >
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
          <Table colWidths={["200px", "120px", "150px", "100px", "100px"]}>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>그룹설문여부</TableHead>
                <TableHead>생성자</TableHead>
                <TableHead>생성일시</TableHead>
                <TableHead>수정일시</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map(
                (survey: SurveyQuestionMstResponse, index: number) => (
                  <TableRow key={index}>
                    <TableCell
                      onClick={() => handleClickTitle(survey.sqMstId)}
                      style={{ cursor: "pointer !important" }}
                    >
                      {survey.title}
                    </TableCell>
                    <TableCell>
                      {survey.groupId != null ? "그룹설문" : "일반설문"}
                    </TableCell>
                    <TableCell>{survey.createMemNum}</TableCell>
                    <TableCell>
                      {parseDateArrayToStringWithoutLast(
                        Array.isArray(survey.createDate)
                          ? survey.createDate
                          : []
                      )}
                    </TableCell>
                    <TableCell>
                      {parseDateArrayToStringWithoutLast(
                        Array.isArray(survey.updateDate)
                          ? survey.updateDate
                          : []
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination
        page={page}
        pageSize={10}
        totalCount={surveyTotalCount}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
