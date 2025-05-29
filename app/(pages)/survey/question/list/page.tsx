"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query"; // or the appropriate library
import { Input } from "@/app/component/common/list/ListInput";
import { Select, SelectItem } from "@/app/component/common/list/Select";
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
import { getCreatedSurveyList } from "@/app/web-api/survey/surveyApi";
import { parseDateArrayToStringWithoutLast } from "@/app/utils/formatter";
import { useRouter } from "next/navigation";
import { formatDateStartEndDate } from "@/app/utils/formatter";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import { useRecoilValue } from "recoil";

export default function SurveyListPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [surveyType, setSurveyType] = useState("모든 설문");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [surveyTotalCount, setSurveyTotalCount] = useState(0);
  const [selected, setSelected] = useState("all");
  const [surveys, setSurveys] = useState([]);
  const { groupId } = useRecoilValue(userAtom);
  const user = useRecoilValue(userAtom);

  const router = useRouter();

  const handleSearch = () => {
    const surveyData: SurveyQuestionMstRequest = {
      title: searchKeyword,
      startDate: startDate
        ? formatDateStartEndDate(startDate, false)
        : undefined,
      endDate: endDate ? formatDateStartEndDate(endDate, true) : undefined,
      groupId:
        selected == "group" ? "group" : selected == "normal" ? "normal" : "",
    };
    mutate({
      ...surveyData,
      page: page - 1,
      size: pageSize,
    });
    debugger;
    setPage(1); // 검색 후 페이지를 1로 초기화
  };

  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    SurveyQuestionMstRequest
  >({
    mutationFn: getCreatedSurveyList,
    onSuccess: (data: any) => {
      setSurveys(data.data.content || []);
      setSurveyTotalCount(data.data.totalElements);
    },
    onError: (error: Error) => {
      console.error("API 호출 중 오류 발생:", error);
    },
  });

  useEffect(() => {
    mutate({
      page: page - 1,
      size: pageSize,
    });
  }, [mutate, page]);

  const handleClickTitle = (mstId: string) => {
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

            <div hidden={groupId == undefined}>
              <Select
                value={selected}
                onValueChange={(val) => setSelected(val)}
              >
                <SelectItem value="all" label="모든 설문" />
                <SelectItem value="normal" label="일반 설문" />
                <SelectItem value="group" label="그룹 설문" />
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
                      className="px-4 py-2 hover:underline cursor-pointer"
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
