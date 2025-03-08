import React from "react";
import "@/app/styles/common/pagination.css";
import {useTranslation} from "react-i18next";


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
    onPageChange: (page: number) => void;
}

export const Pagination = ({
                               currentPage
                               , totalPages
                               , totalElements
                               , first
                               , last
                               , onPageChange
                           }: PaginationProps) => {

    const {t} = useTranslation();

    const pageSize = 10; // 한 블록에 10페이지씩 표시
    const startPage = Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
    const endPage = Math.min(startPage + pageSize - 1, totalPages);


    return (
        <div className="pagination-container">
            <button
                className="pagination-button"
                disabled={first}
                onClick={() => onPageChange(currentPage - 1)}
            >
                {t("PREV")}
            </button>

            <div className="pagination-pages">
                {Array.from({length: endPage - startPage + 1}, (_, index) => {
                    const page = startPage + index;
                    return (
                        <button
                            key={page}
                            className={`pagination-page-button ${page === currentPage ? "active" : ""}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>


            <button
                className="pagination-button"
                disabled={last}
                onClick={() => onPageChange(currentPage + 1)}
            >
                {t("NEXT")}
            </button>
        </div>
    );
};

