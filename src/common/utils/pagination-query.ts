type PaginationQuery = {
  limit: number;
  page: number;
  skip: number;
  sort?: Record<string, 1 | -1>;
};

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;
const DEFAULT_PAGE = 1;
const ALLOWED_SORT_FIELDS = [
  'createdAt',
  'name',
  'price',
  '-price',
  '-createdAt',
];

interface InputQuery {
  limit?: string | number;
  page?: string | number;
  sort?: string;
}

export function parsePaginationQuery(query: InputQuery): PaginationQuery {
  const limit = parseInt(String(query.limit), 10);
  const page = parseInt(String(query.page), 10);
  const sort = typeof query.sort === 'string' ? query.sort : undefined;

  const finalLimit =
    isNaN(limit) || limit <= 0 || limit > MAX_LIMIT ? DEFAULT_LIMIT : limit;
  const finalPage = isNaN(page) || page <= 0 ? DEFAULT_PAGE : page;

  const isValidSort = !sort || ALLOWED_SORT_FIELDS.includes(sort);

  return {
    limit: finalLimit,
    page: finalPage,
    sort: isValidSort ? formatSort(query?.sort) : undefined,
    skip: (finalPage - 1) * finalLimit,
  };
}

export function formatSort(sort?: string): Record<string, 1 | -1> {
  if (!sort) {
    return {};
  }
  if (sort.startsWith('-')) {
    return { [sort.slice(1)]: -1 };
  }
  return { [sort]: 1 };
}
