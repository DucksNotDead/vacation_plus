using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VacationPlusNewAPI.Migrations
{
    /// <inheritdoc />
    public partial class Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VacationIntervalIds",
                table: "VacationYears");

            migrationBuilder.DropColumn(
                name: "UnitIds",
                table: "Departments");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "VacationYears",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YearId",
                table: "VacationIntervals",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "Units",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "VacationYears");

            migrationBuilder.DropColumn(
                name: "YearId",
                table: "VacationIntervals");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Units");

            migrationBuilder.AddColumn<string>(
                name: "VacationIntervalIds",
                table: "VacationYears",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UnitIds",
                table: "Departments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
