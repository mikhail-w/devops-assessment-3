#!/bin/bash

# Set your AWS region
AWS_REGION="us-east-1"

# Add colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=============================================${NC}"
echo -e "${YELLOW}      AWS Resource Cleanup Utility           ${NC}"
echo -e "${YELLOW}=============================================${NC}"

echo -e "\n${YELLOW}Fetching resource IDs...${NC}"

# Get instance ID
INSTANCE_ID=$(aws ec2 describe-instances \
  --region $AWS_REGION \
  --filters "Name=tag:Name,Values=pokedex-app-server" \
  --query "Reservations[*].Instances[*].InstanceId" \
  --output text)

# Get the EIP allocation ID
EIP_ID=$(aws ec2 describe-addresses \
  --region $AWS_REGION \
  --filters "Name=tag:Name,Values=pokedex-app-eip" \
  --query "Addresses[*].AllocationId" \
  --output text)

# Get the security group ID
SG_ID=$(aws ec2 describe-security-groups \
  --region $AWS_REGION \
  --filters "Name=group-name,Values=pokedex-app-sg" \
  --query "SecurityGroups[*].GroupId" \
  --output text)

# Get the key pair name
KEY_NAME="pokedex-app-key"

echo -e "\n${YELLOW}Resources found:${NC}"
[ -z "$INSTANCE_ID" ] && echo -e "EC2 Instance:    ${RED}Not found${NC}" || echo -e "EC2 Instance:    ${GREEN}$INSTANCE_ID${NC}"
[ -z "$EIP_ID" ] && echo -e "Elastic IP:       ${RED}Not found${NC}" || echo -e "Elastic IP:       ${GREEN}$EIP_ID${NC}"
[ -z "$SG_ID" ] && echo -e "Security Group:   ${RED}Not found${NC}" || echo -e "Security Group:   ${GREEN}$SG_ID${NC}"
echo -e "Key Pair:        ${GREEN}$KEY_NAME${NC}"

echo -e "\n${YELLOW}Starting cleanup process...${NC}"

# Step 1: Terminate the EC2 instance if exists
if [ ! -z "$INSTANCE_ID" ]; then
  echo -ne "Terminating EC2 instance... "
  aws ec2 terminate-instances --region $AWS_REGION --instance-ids $INSTANCE_ID --output text > /dev/null
  echo -e "${GREEN}Request sent${NC}"
  
  echo -ne "Waiting for instance to terminate... "
  aws ec2 wait instance-terminated --region $AWS_REGION --instance-ids $INSTANCE_ID
  echo -e "${GREEN}Done${NC}"
else
  echo -e "Skipping EC2 termination - No instance found"
fi

# Step 2: Release the EIP if exists
if [ ! -z "$EIP_ID" ]; then
  echo -ne "Releasing Elastic IP... "
  aws ec2 release-address --region $AWS_REGION --allocation-id $EIP_ID
  echo -e "${GREEN}Done${NC}"
else
  echo -e "Skipping EIP release - No Elastic IP found"
fi

# Step 3: Wait a moment to ensure all dependencies are cleared
echo -ne "Waiting for resources to be fully released... "
sleep 10
echo -e "${GREEN}Done${NC}"

# Step 4: Delete the security group if exists
if [ ! -z "$SG_ID" ]; then
  echo -ne "Deleting security group... "
  if aws ec2 delete-security-group --region $AWS_REGION --group-id $SG_ID 2>/dev/null; then
    echo -e "${GREEN}Done${NC}"
  else
    echo -e "${RED}Failed${NC} (May have dependencies)"
    echo -e "Retrying in 30 seconds..."
    sleep 30
    echo -ne "Retrying security group deletion... "
    if aws ec2 delete-security-group --region $AWS_REGION --group-id $SG_ID 2>/dev/null; then
      echo -e "${GREEN}Done${NC}"
    else
      echo -e "${RED}Failed${NC}"
      echo -e "You may need to delete the security group manually in the AWS console"
    fi
  fi
else
  echo -e "Skipping security group deletion - No security group found"
fi

# Step 5: Delete the key pair if exists
echo -ne "Deleting key pair... "
aws ec2 delete-key-pair --region $AWS_REGION --key-name $KEY_NAME
echo -e "${GREEN}Done${NC}"

echo -e "\n${GREEN}=============================================${NC}"
echo -e "${GREEN}      Cleanup process completed               ${NC}"
echo -e "${GREEN}=============================================${NC}"