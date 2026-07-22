using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VacationPlusNewAPI.Migrations
{
    /// <inheritdoc />
    public partial class UserDepartamentToUserDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Departament_id",
                table: "Users",
                newName: "DepartmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DepartmentId",
                table: "Users",
                newName: "Departament_id");
        }
    }
}
