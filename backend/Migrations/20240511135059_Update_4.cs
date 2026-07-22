using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VacationPlusNewAPI.Migrations
{
    /// <inheritdoc />
    public partial class Update_4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VacationYearId",
                table: "VacationRequests",
                newName: "YearId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "YearId",
                table: "VacationRequests",
                newName: "VacationYearId");
        }
    }
}
