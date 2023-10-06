export const localizationTable = (t) => ({
  toolbarDensity: t("dTable.toolbarDensity"),
  toolbarDensityLabel: t("dTable.toolbarDensityLabel"),
  toolbarDensityCompact: t("dTable.toolbarDensityCompact"),
  toolbarDensityStandard: t("dTable.toolbarDensityStandard"),
  toolbarDensityComfortable: t("dTable.toolbarDensityComfortable"),

  toolbarExport: t("dTable.toolbarExport"),
  toolbarExportLabel: t("dTable.toolbarExportLabel"),
  toolbarExportCSV: t("dTable.toolbarExportCSV"),
  toolbarExportPrint: t("dTable.toolbarExportPrint"),

  columnHeaderFiltersLabel: t("dTable.columnHeaderFiltersLabel"),
  columnMenuHideColumn: t("dTable.columnMenuHideColumn"),
  columnMenuLabel: t("dTable.columnMenuLabel"),
  columnMenuShowColumns: t("dTable.columnMenuShowColumns"),
  columnsPanelShowAllButton: t("dTable.columnsPanelShowAllButton"),
  columnsPanelHideAllButton: t("dTable.columnsPanelHideAllButton"),
  columnsPanelTextFieldLabel: t("dTable.columnsPanelTextFieldLabel"),
  columnsPanelTextFieldPlaceholder: t(
    "dTable.columnsPanelTextFieldPlaceholder"
  ),
  toolbarColumnsLabel: t("dTable.toolbarColumnsLabel"),
  toolbarColumns: t("dTable.toolbarColumnsLabel"),
  filterPanelColumns: t("dTable.toolbarColumnsLabel"),

  toolbarFilters: t("dTable.toolbarFilters"),
  toolbarFiltersLabel: t("dTable.toolbarFilters"),
  filterPanelInputLabel: t("dTable.filterPanelInputLabel"),
  filterPanelInputPlaceholder: t("dTable.filterPanelInputLabel"),
  filterPanelOperator: t("dTable.filterPanelOperator"),
  filterOperatorContains: t("dTable.filterOperatorContains"),
  filterOperatorEquals: t("dTable.filterOperatorEquals"),
  filterOperatorStartsWith: t("dTable.filterOperatorStartsWith"),
  filterOperatorEndsWith: t("dTable.filterOperatorEndsWith"),
  filterOperatorIsEmpty: t("dTable.filterOperatorIsEmpty"),
  filterOperatorIsNotEmpty: t("dTable.filterOperatorIsNotEmpty"),
  filterOperatorIsAnyOf: t("dTable.filterOperatorIsAnyOf"),

  toolbarFiltersTooltipShow: t("open"),
  toolbarFiltersTooltipHide: t("close"),

  footerRowSelected: (num) => t("dTable.footerRowSelected", { num }),

  MuiTablePagination: { labelRowsPerPage: t("dTable.labelRowsPerPage") },
  // footerTotalVisibleRows: "balki",
  // footerTotalRows: "main",
});
