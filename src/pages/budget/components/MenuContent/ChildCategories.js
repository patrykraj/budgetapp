import React from "react";
import PropTypes from "prop-types";
import formatCurrency from "../../../../utils/formatCurrency";

const ChildCategories = ({ items, id, spentAmount }) => {
  return items.map(
    (category) =>
      id === category.parentCategoryId && (
        <li key={category.id}>
          <span>{category.name}</span>
          <span className="data-field">{formatCurrency(category.budget)}</span>
          <span
            className={`data-field ${
              spentAmount[category.id] > category.budget ? "exceed" : ""
            }`}
          >
            {formatCurrency(spentAmount[category.id] || 0)}
          </span>
        </li>
      )
  );
};

export default React.memo(ChildCategories);

ChildCategories.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  id: PropTypes.number.isRequired,
  spentAmount: PropTypes.shape({}).isRequired,
};
