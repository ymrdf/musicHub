#!/bin/bash

# musicHub 数据库初始化脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 数据库配置
DB_HOST="127.0.0.1"
DB_USER="admin"
DB_PASSWORD="ymrdf"
DB_NAME="musicHub"

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}           MusicHub 数据库初始化工具           ${NC}"
echo -e "${BLUE}=================================================${NC}"

# 检查 MySQL 是否安装
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}错误: MySQL 未安装或不在 PATH 中${NC}"
    exit 1
fi

echo -e "${YELLOW}数据库配置信息:${NC}"
echo -e "主机: ${DB_HOST}"
echo -e "用户: ${DB_USER}"
echo -e "数据库: ${DB_NAME}"
echo ""

# 函数：执行SQL文件
execute_sql_file() {
    local file=$1
    local description=$2
    
    echo -e "${YELLOW}正在执行: ${description}${NC}"
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}错误: 文件 $file 不存在${NC}"
        return 1
    fi
    
    if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" < "$file"; then
        echo -e "${GREEN}✓ ${description} 执行成功${NC}"
        return 0
    else
        echo -e "${RED}✗ ${description} 执行失败${NC}"
        return 1
    fi
}

# 函数：测试数据库连接
test_connection() {
    echo -e "${YELLOW}测试数据库连接...${NC}"
    
    if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✓ 数据库连接成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 数据库连接失败，请检查配置${NC}"
        return 1
    fi
}

# 函数：检查数据库是否存在
check_database_exists() {
    local db_exists=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='$DB_NAME';" 2>/dev/null | grep -c "$DB_NAME")
    return $db_exists
}

# 函数：备份数据库
backup_database() {
    if check_database_exists; then
        local backup_file="musicHub_backup_$(date +%Y%m%d_%H%M%S).sql"
        echo -e "${YELLOW}发现现有数据库，正在备份到 $backup_file${NC}"
        
        if mysqldump -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$backup_file"; then
            echo -e "${GREEN}✓ 数据库备份成功${NC}"
        else
            echo -e "${RED}✗ 数据库备份失败${NC}"
            return 1
        fi
    fi
}

# 主菜单
show_menu() {
    echo ""
    echo -e "${BLUE}请选择操作:${NC}"
    echo "1. 完整初始化（创建表结构 + 插入示例数据）"
    echo "2. 仅创建表结构"
    echo "3. 仅插入示例数据"
    echo "4. 重置数据库（删除现有数据库并重新创建）"
    echo "5. 备份现有数据库"
    echo "6. 测试数据库连接"
    echo "7. 查看数据库状态"
    echo "0. 退出"
    echo ""
    read -p "请输入选项 (0-7): " choice
}

# 查看数据库状态
show_database_status() {
    echo -e "${YELLOW}查询数据库状态...${NC}"
    
    mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "
    USE $DB_NAME;
    SELECT 
        'users' as table_name, COUNT(*) as record_count FROM users
    UNION ALL
    SELECT 'works', COUNT(*) FROM works
    UNION ALL  
    SELECT 'performances', COUNT(*) FROM performances
    UNION ALL
    SELECT 'comments', COUNT(*) FROM comments
    UNION ALL
    SELECT 'categories', COUNT(*) FROM categories
    UNION ALL
    SELECT 'tags', COUNT(*) FROM tags;
    " 2>/dev/null || echo -e "${RED}无法获取数据库状态，请检查数据库是否存在${NC}"
}

# 重置数据库
reset_database() {
    echo -e "${RED}警告: 这将删除现有的 $DB_NAME 数据库！${NC}"
    read -p "确定要继续吗？(y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        backup_database
        
        echo -e "${YELLOW}删除现有数据库...${NC}"
        mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "DROP DATABASE IF EXISTS $DB_NAME;"
        
        echo -e "${YELLOW}创建新数据库...${NC}"
        mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        
        echo -e "${GREEN}✓ 数据库重置完成${NC}"
    else
        echo -e "${YELLOW}操作已取消${NC}"
    fi
}

# 主程序
main() {
    # 测试连接
    if ! test_connection; then
        exit 1
    fi
    
    while true; do
        show_menu
        
        case $choice in
            1)
                echo -e "${BLUE}开始完整初始化...${NC}"
                execute_sql_file "init.sql" "创建表结构" && \
                execute_sql_file "seed.sql" "插入示例数据"
                ;;
            2)
                execute_sql_file "init.sql" "创建表结构"
                ;;
            3)
                execute_sql_file "seed.sql" "插入示例数据"
                ;;
            4)
                reset_database
                ;;
            5)
                backup_database
                ;;
            6)
                test_connection
                ;;
            7)
                show_database_status
                ;;
            0)
                echo -e "${GREEN}再见！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}无效选项，请重新选择${NC}"
                ;;
        esac
        
        echo ""
        read -p "按 Enter 键继续..." dummy
    done
}

# 运行主程序
main
