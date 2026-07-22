using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VacationPlusNewAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSlashes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Short_fio",
                table: "Users",
                newName: "ShortFio");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShortFio",
                table: "Users",
                newName: "Short_fio");
        }
    }
}
