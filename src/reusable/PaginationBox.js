import Spinner from './Spinner';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react';

const PaginationBox = (props) => {
  const {
    page,
    totalPages,
    loading,
    exportGrid,
    onBtFirst,
    onBtPrevious,
    onBtNext,
    onBtLast,
    rowData
  } = props;

  return (
    <div className="pagination-box">
      <CButton
        className="export-button"
        color="secondary"
        onClick={exportGrid}
        disabled={loading}
      >
        {loading ? <Spinner size={20} /> : 'Exportar'}
      </CButton>
      <button
        className="pagination-button"
        onClick={onBtFirst}
        disabled={page === 1}
      >
        <CIcon name="cil-chevron-double-left" height="20" />
      </button>
      <button
        className="pagination-button"
        onClick={onBtPrevious}
        disabled={page === 1}
      >
        <CIcon name="cil-chevron-left" height="20" />
      </button>

      {rowData && (
        <div style={{ fontWeight: 'bold', margin: '0px 15px' }}>
          {page} de {totalPages}
        </div>
      )}

      <button
        className="pagination-button"
        onClick={onBtNext}
        disabled={page === totalPages}
      >
        <CIcon name="cil-chevron-right" height="20" />
      </button>
      <button
        className="pagination-button"
        onClick={onBtLast}
        disabled={page === totalPages}
      >
        <CIcon name="cil-chevron-double-right" height="20" />
      </button>
    </div>
  );
};

export default PaginationBox;
