import { CustomValidation } from '../Util/custom-validation.schema';

export async function pager(req, queryBuilder, entity, sortColumn) {
  if (req.query.sortMethod) {
    const sort: string = req.query.sortMethod.toString().trim() || 'desc';
    if (sort.toUpperCase() == 'ASC' || sort.toUpperCase() == 'DESC') {
      if (sort && req.query.sortCol) {
        queryBuilder.orderBy(
          entity + '.' + req.query.sortCol,
          sort.toUpperCase(),
        );
      }
    } else {
      return new CustomValidation('Invalid sort method');
    }
  } else {
    queryBuilder.orderBy(entity + '.' + sortColumn, 'DESC');
  }

  if (parseInt(req.query.pageNo) == 0) {
    return new CustomValidation('zero is not a page');
  }
  const page: number = parseInt(req.query.pageNo) || 1;
  const limit: number = parseInt(req.query.limit) || null;
  const startIndex = (page - 1) * limit;

  queryBuilder.offset(startIndex).limit(limit);
  const total = await queryBuilder.getCount();
  const data = await queryBuilder.getMany();

  const dataCount = data.length;
  return {
    total: total,
    dataCount: dataCount,
    page: page,
    data: data,
  };
}
