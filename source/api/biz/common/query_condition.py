from typing import Optional
from sqlalchemy.orm import Query
from pydantic import BaseModel
from sqlalchemy import (or_, not_)
from common.constant import const
from common.enum import OperationType, ConditionType


class Condition(BaseModel):
    column: str = const.EMPTY_STR
    values: list[str] = []
    condition: Optional[str] = ConditionType.AND.value
    operation: Optional[str] = OperationType.EQUAL.value


class QueryCondition(BaseModel):
    page: Optional[int] = 1
    size: Optional[int] = 20
    sort_column: Optional[str] = const.EMPTY_STR
    asc: Optional[bool] = True
    conditions: Optional[list[Condition]]


def query_with_condition(query: Query, condition: QueryCondition):
    table_obj = query.column_descriptions[0]['type']
    free_search_columns = []
    free_search_conditions = []
    in_conditions = []
    for column in [item for item in dir(table_obj) if not item.startswith('_')]:
        if hasattr(getattr(table_obj, column), 'info') and getattr(table_obj, column).info.get('searchable'):
            free_search_columns.append(column)
    if condition and condition.conditions:
        for c in condition.conditions:
            if c.column:
                table_value = getattr(table_obj, c.column)
                if c.operation == OperationType.EQUAL.value:
                    query = query.filter(table_value == c.values)
                elif c.operation == OperationType.NOT_EQUAL.value:
                    query = query.filter(table_value != c.values)
                elif c.operation == OperationType.CONTAIN.value:
                    query = query.filter(table_value.contains(c.values))
                elif c.operation == OperationType.IN.value:
                    for item in c.values:
                        in_conditions.append(table_value == item)
                    query = query.filter(or_(*in_conditions))
                else:
                    query = query.filter(or_(table_value == None, not_(table_value.contains(c.values))))
            elif free_search_columns:
                for column in (free_search_columns or []):
                    free_search_conditions.append(getattr(table_obj, column).contains(c.values[0], autoescape=True))
                query = query.filter(or_(*free_search_conditions))
            else:
                pass
    if condition and condition.sort_column:
        sort_column = getattr(table_obj, condition.sort_column)
        if condition.asc:
            query = query.order_by(sort_column)
        else:
            query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(getattr(table_obj, 'modify_time').desc())
    return query


def query_with_condition_multi_table(query: Query, condition: QueryCondition, mappings: dict, ignoreProperties: list):
    free_search_columns = []
    free_search_conditions = []
    for column in [cmn for cmn, vle in mappings.items() if cmn not in ignoreProperties and vle[1]]:
        free_search_columns.append(column)
    if condition and condition.conditions:
        for c in condition.conditions:
            if c.column and c.column not in ignoreProperties:
                table_value = mappings[c.column][0]
                if c.operation == OperationType.EQUAL.value:
                    query = query.filter(table_value == c.values)
                elif c.operation == OperationType.NOT_EQUAL.value:
                    query = query.filter(table_value != c.values)
                elif c.operation == OperationType.CONTAIN.value:
                    query = query.filter(table_value.contains(c.values))
                else:
                    query = query.filter(or_(table_value == None, not_(table_value.contains(c.values))))
            elif not c.column and free_search_columns:
                for column in (free_search_columns or []):
                    free_search_conditions.append(mappings[column][0].contains(c.values[0], autoescape=True))
                query = query.filter(or_(*free_search_conditions))
            else:
                pass
    if condition and condition.sort_column:
        sort_column = mappings[condition.sort_column][0]
        if condition.asc:
            query = query.order_by(sort_column)
        else:
            query = query.order_by(sort_column.desc())
    return query
